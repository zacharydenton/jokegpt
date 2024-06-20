import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();
const model = process.env.OPENAI_MODEL || "gpt-4o";

export const maxDuration = 30;

export async function POST(req: Request) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "Devise a humorous, yet mildly clever one-liner joke suitable for general audiences. Ensure the joke incorporates a bit of surprise or intellectual wit. Do not include any commentary.",
    },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
