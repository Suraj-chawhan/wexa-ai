import { v4 as uuidv4 } from "uuid";
import { ChatGroq } from "@langchain/groq";
import Audit from "./models/Audit.js";
import KB from "./models/KB.js";
import HumanProblem from "./models/HumanProblem.js";

async function auditLog(ticketId, action, meta, trace = "") {
  await Audit.create({ ticketId, action, meta, trace, createdAt: new Date() });
}

function extractJson(str = "") {
  const unfenced = str.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return JSON.parse(unfenced.slice(start, end + 1));
  }
  return JSON.parse(unfenced);
}

function kbMatchBoost(description, kbArticles, usedIds) {
  if (Array.isArray(usedIds) && usedIds.length > 0) return 0.85;
  const text = (description || "").toLowerCase();
  if (!text) return 0;
  const tokens = Array.from(new Set(text.split(/[^a-z0-9]+/i).filter(w => w.length > 2))).slice(0, 15);
  let overlaps = 0;
  for (const a of kbArticles) {
    const hay = `${a.title || ""} ${a.body || ""} ${(a.tags || []).join(" ")}`.toLowerCase();
    overlaps = Math.max(overlaps, tokens.filter(t => hay.includes(t)).length);
  }
  return overlaps >= 3 ? 0.85 : 0;
}

export async function runWorkflowOnTicket(ticketDoc) {
  const traceId = uuidv4();
  const kbArticles = await KB.find().lean();
  await auditLog(ticketDoc._id, "KB_RETRIEVED", { articles: kbArticles.map(a => a.title) }, traceId);

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });

  const system = `You are a support triage assistant.
Return STRICT JSON: {"category":"billing|tech|shipping|other","confidence":0-1,"draft":"reply","usedIds":["kb ids"]}`;

  const userMsg = {
    role: "user",
    content:
      `TICKET:\n` +
      JSON.stringify({ id: ticketDoc._id.toString(), title: ticketDoc.title, description: ticketDoc.description }, null, 2) +
      `\n\nKB CANDIDATES:\n` +
      JSON.stringify(kbArticles.map(a => ({ _id: a._id, title: a.title, body: a.body, tags: a.tags || [] })), null, 2),
  };

  let parsed = { category: "other", confidence: 0.5, draft: "Our team will review shortly.", usedIds: [] };

  const resp = await llm.invoke([{ role: "system", content: system }, userMsg]);
  try {
    const content = typeof resp?.content === "string" ? resp.content : resp?.content?.[0]?.text || "";
    const j = extractJson(content);
    parsed = {
      category: j.category || "other",
      confidence: typeof j.confidence === "number" ? Math.max(0, Math.min(1, j.confidence)) : 0.5,
      draft: j.draft?.trim() || "Our team will review shortly.",
      usedIds: Array.isArray(j.usedIds) ? j.usedIds : [],
    };
  } catch (e) {
    await auditLog(ticketDoc._id, "LLM_PARSE_FALLBACK", { raw: resp?.content }, traceId);
  }

  const boost = kbMatchBoost(ticketDoc.description, kbArticles, parsed.usedIds);
  if (boost) parsed.confidence = Math.max(parsed.confidence, boost);

  await auditLog(ticketDoc._id, "DRAFT_CREATED", { draft: parsed.draft, category: parsed.category, confidence: parsed.confidence, usedIds: parsed.usedIds }, traceId);

  const final = { ...ticketDoc.toObject(), category: parsed.category, draft: parsed.draft };

  if (parsed.confidence >= 0.8 && parsed.draft) {
    final.status = "resolved";
    await auditLog(ticketDoc._id, "AUTO_CLOSED", { confidence: parsed.confidence }, traceId);
  } else {
    final.status = "pending_human";
    await auditLog(ticketDoc._id, "ASSIGNED_TO_HUMAN", { confidence: parsed.confidence }, traceId);
    await HumanProblem.findOneAndUpdate(
      { ticketId: ticketDoc._id },
      { ticketId: ticketDoc._id, userId: ticketDoc.userId, title: ticketDoc.title, description: ticketDoc.description, draft: parsed.draft, category: parsed.category, confidence: parsed.confidence, status: "waiting_human" },
      { upsert: true, new: true }
    );
  }

  return final;
}
