// app/api/chat/route.js
import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = new ChatGroq({
      
      model: "llama-3.3-70b-versatile", // You can also use "llama3-70b-8192"
    });

    const result = await model.invoke(prompt);

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

