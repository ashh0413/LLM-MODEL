import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  prompt: string;
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { prompt, max_new_tokens = 100, temperature = 1.0, top_p = 0.9 } = body;

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const modelId = process.env.HUGGINGFACE_MODEL_ID || "gpt2";

    if (!apiKey) {
      // Return mock data for demo purposes when no API key
      return NextResponse.json(generateMockResponse(prompt, max_new_tokens));
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens,
            temperature,
            top_p,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();

    // Hugging Face returns array like [{ generated_text }]
    const generatedText =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : typeof data === "object" && "generated_text" in data
        ? data.generated_text
        : "";

    return NextResponse.json({
      text: generatedText,
      tokens: Array.from(generatedText).map((_, i) => i),
      log_probs: generatedText.split("").map(() => Math.random() * -1),
      attention_weights: generateMockAttention(generatedText.length),
      token_details: generatedText.split("").map((char: string, i: number) => ({
        id: i,
        str: char,
      })),
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateMockResponse(prompt: string, maxTokens: number) {
  const mockText = `This is a mock response to: "${prompt.slice(0, 50)}..." The actual response would come from Hugging Face Inference API when HUGGINGFACE_API_KEY is configured.`;
  return {
    text: mockText,
    tokens: Array.from(mockText).map((_, i) => i),
    log_probs: mockText.split("").map(() => Math.random() * -1),
    attention_weights: generateMockAttention(mockText.length),
    token_details: mockText.split("").map((char, i) => ({
      id: i,
      str: char,
    })),
  };
}

function generateMockAttention(seqLen: number) {
  const layers = 12;
  return Array.from({ length: layers }, (_, layerIdx) => ({
    layer: layerIdx,
    weights: [
      Array.from({ length: 12 }, () =>
        Array.from({ length: seqLen }, () =>
          Array.from({ length: seqLen }, () => Math.random())
        )
      ),
    ],
  }));
}
