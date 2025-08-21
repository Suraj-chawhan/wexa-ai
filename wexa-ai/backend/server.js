import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { signJWT, authMiddleware, requireAdmin, requireAgent } from "./config/auth.js";

import User from "./models/User.js";
import KB from "./models/KB.js";
import Ticket from "./models/Ticket.js";
import HumanProblem from "./models/HumanProblem.js";
import Audit from "./models/Audit.js";

import { runWorkflowOnTicket } from "./workflow.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

await connectDB(process.env.MONGODB_URI);

/* ---------------------- AUTH ---------------------- */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name, isAdmin, isHumanAgent } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Email exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, isAdmin, isHumanAgent });
    return res.json({ token: signJWT(user) });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid creds" });
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ error: "Invalid creds" });
    }
    return res.json({ token: signJWT(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Add /api/auth/me
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/* ---------------------- KB ---------------------- */
app.get("/api/kb", authMiddleware, async (req, res) => {
  try {
    res.json(await KB.find().lean());
  } catch (err) {
    console.error("KB fetch error:", err);
    res.status(500).json({ error: "Failed to fetch KB" });
  }
});

app.post("/api/kb", authMiddleware, requireAdmin, async (req, res) => {
  try {
    res.json(await KB.create(req.body));
  } catch (err) {
    console.error("KB create error:", err);
    res.status(500).json({ error: "Failed to create KB" });
  }
});

app.delete("/api/kb/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const kb = await KB.findById(req.params.id);
    if (!kb) return res.status(404).json({ error: "KB not found" });
    await kb.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("KB delete error:", err);
    res.status(500).json({ error: "Failed to delete KB" });
  }
});

/* ---------------------- TICKETS ---------------------- */
app.get("/api/tickets", authMiddleware, async (req, res) => {
  try {
    res.json(await Ticket.find({ userId: req.user.sub }).lean());
  } catch (err) {
    console.error("Tickets fetch error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

app.post("/api/tickets", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      userId: req.user.sub,
      status: "open",
      draft: "",
      category: ""
    });
    const final = await runWorkflowOnTicket(ticket);
    Object.assign(ticket, {
      status: final.status,
      draft: final.draft,
      category: final.category,
      needsHuman: final.status === "pending_human",
    });
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error("Ticket create error:", err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

app.delete("/api/tickets/:id", authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, userId: req.user.sub });
    if (!ticket) return res.status(404).json({ error: "Ticket not found or not yours" });
    await ticket.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("Ticket delete error:", err);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

/* ---------------------- HUMAN AGENT ---------------------- */
app.get("/api/human/tickets", authMiddleware, requireAgent, async (req, res) => {
  try {
    res.json(await Ticket.find({ status: "pending_human" }).lean());
  } catch (err) {
    console.error("Human ticket fetch error:", err);
    res.status(500).json({ error: "Failed to fetch human tickets" });
  }
});

app.post("/api/tickets/:id/human-reply", authMiddleware, requireAgent, async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.status = "resolved";
    ticket.draft = reply || ticket.draft || "";
    ticket.needsHuman = false;
    await ticket.save();

    await Audit.create({
      ticketId: ticket._id,
      action: "HUMAN_RESPONSE",
      meta: { reply },
      createdAt: new Date(),
    });

    await HumanProblem.deleteOne({ ticketId: ticket._id });
    res.json(ticket);
  } catch (err) {
    console.error("Human reply error:", err);
    res.status(500).json({ error: "Failed to submit human reply" });
  }
});

/* ---------------------- AUDITS ---------------------- */
app.get("/api/audits", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.sub });
    const ticketIds = tickets.map((t) => t._id);
    res.json(await Audit.find({ ticketId: { $in: ticketIds } }).sort({ createdAt: 1 }).lean());
  } catch (err) {
    console.error("Audit fetch error:", err);
    res.status(500).json({ error: "Failed to fetch audits" });
  }
});

/* ---------------------- SERVER ---------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
