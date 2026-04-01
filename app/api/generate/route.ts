import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { agents } from "@/lib/agents";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { agentName, message, threadContext, channel } = await request.json();

    const agent = agents.find((a) => a.name === agentName);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const userMessage = threadContext
      ? `Channel: ${channel || "general"}\n\nThread context:\n${threadContext}\n\nLatest message to respond to:\n${message}`
      : `Channel: ${channel || "general"}\n\nMessage to respond to:\n${message}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: agent.prompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text, agent: agentName });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
