import { NextResponse } from "next/server";
import { Whop } from "@whop/sdk";

const whop = new Whop({
  apiKey: process.env.WHOP_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { channelId, content, agentName } = await request.json();

    if (!channelId || !content) {
      return NextResponse.json(
        { error: "channelId and content are required" },
        { status: 400 }
      );
    }

    const message = await whop.messages.create({
      channel_id: channelId,
      content,
    });

    return NextResponse.json({
      success: true,
      agent: agentName,
      messageId: message.id,
    });
  } catch (error) {
    console.error("Post to Whop error:", error);
    return NextResponse.json(
      { error: "Failed to post to Whop" },
      { status: 500 }
    );
  }
}
