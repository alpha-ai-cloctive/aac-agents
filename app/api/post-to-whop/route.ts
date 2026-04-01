import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { channelId, content, agentName, agentUsername } =
      await request.json();

    if (!channelId || !content) {
      return NextResponse.json(
        { error: "channelId and content are required" },
        { status: 400 }
      );
    }

    if (!agentUsername) {
      return NextResponse.json(
        { error: "agentUsername is required" },
        { status: 400 }
      );
    }

    // Look up the agent's Whop token from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: agentToken, error: lookupError } = await supabase
      .from("agent_tokens")
      .select("token")
      .eq("username", agentUsername)
      .single();

    if (lookupError || !agentToken) {
      return NextResponse.json(
        { error: `No token found for agent username: ${agentUsername}` },
        { status: 404 }
      );
    }

    // Post message via Whop API using the agent's Bearer token
    const whopRes = await fetch("https://api.whop.com/v5/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${agentToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel_id: channelId,
        content,
      }),
    });

    if (!whopRes.ok) {
      const errBody = await whopRes.text();
      console.error("Whop API error:", whopRes.status, errBody);
      return NextResponse.json(
        { error: "Failed to post to Whop" },
        { status: whopRes.status }
      );
    }

    const message = await whopRes.json();

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
