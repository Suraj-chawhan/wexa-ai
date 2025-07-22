import { CohereEmbeddings } from "@langchain/cohere"; // ✅ NEW
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Document } from "langchain/document";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response("Missing prompt", { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "myfile.txt");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const document = new Document({ pageContent: fileContent });

    // ✅ Cohere Embeddings
    const embeddings = new CohereEmbeddings({
      apiKey:"ws5u7SznKixTMH28WGnJMC0tbt5lTtu6Gk3VB8QA", // e.g. 'ws5u7SznKixTMH28WGnJMC0tbt5lTtu6Gk3VB8QA'
      modelName: "embed-english-v3.0", // or v2 if needed
    });

    const vectorStore = await MemoryVectorStore.fromDocuments([document], embeddings);
    const relevantDocs = await vectorStore.similaritySearch(prompt, 1);

    const model = new ChatGroq({
      model: "llama-3-70b-8192",
      apiKey: process.env.GROQ_API_KEY,
    });

    const promptTemplate = ChatPromptTemplate.fromTemplate(`
Answer the following question using the context provided. in 10 words

Context: {context}
Question: {prompt}
    `);

    const chain = await createStuffDocumentsChain({
      llm: model,
      prompt: promptTemplate,
    });

    const answer = await chain.invoke({
      context: relevantDocs,
      prompt,
    });

    return new Response(answer, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
