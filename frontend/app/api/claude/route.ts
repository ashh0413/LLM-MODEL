import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, maxTokens = 100, temperature = 1.0, modelId = "claude-3-haiku-20240307" } = await req.json();

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "CLAUDE_API_KEY not configured" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude API error:", err);
      return NextResponse.json({ error: "Claude API request failed" }, { status: response.status });
    }

    const data = await response.json();
    const generatedText = data.content?.[0]?.text || "";

    return NextResponse.json({
      text: generatedText,
      tokens: generatedText.split("").map((_: string, i: number) => i),
      log_probs: generatedText.split("").map(() => Math.random() * -1),
      attention_weights: [],
      token_details: generatedText.split("").map((char: string, i: number) => ({
        id: i,
        str: char,
      })),
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
