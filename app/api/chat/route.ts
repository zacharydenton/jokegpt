import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { OpenAIStream, StreamingTextResponse } from "ai";

import WOCKA from "./wocka.json";
const JOKES = Object.groupBy(WOCKA, (joke) => joke.category);

const openai = new OpenAI();
const model = process.env.OPENAI_MODEL || "gpt-4o";

type GenerateJokeParams = {
  category: string;
  topic: string;
  temperature: number;
};

function randomJokes(category: string, count: number) {
  const result = [];
  const jokes = JOKES[category] ?? JOKES["One Liners"];
  let offset = Math.floor(Math.random() * jokes.length);
  for (let i = 0; i < count; i++) {
    result.push(jokes[offset].body);
    offset = (offset + 1) % jokes.length;
  }
  return result;
}

function jokePrompt({ category, topic }: GenerateJokeParams) {
  const exampleJokes = randomJokes(category, 10);
  return `
CONTEXT:
${exampleJokes.join("\n\n")}

INSTRUCTIONS:
Generate ONE joke similar to the jokes in the CONTEXT above. The joke MUST match the style of the jokes in the CONTEXT above. DO NOT include any commentary. Ensure that the joke involves ${topic}.
`.trim();
}

function generateJokeResponse(params: GenerateJokeParams) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: jokePrompt(params),
    },
  ];

  return openai.chat.completions.create({
    model,
    messages,
    stream: true,
    temperature: params.temperature,
  });
}

export async function POST(req: Request) {
  const data = (await req.json())?.data ?? {};
  const jokeParams = {
    category: data.category ?? "One Liners",
    topic: data.topic ?? "programming",
    temperature: Number(data.temperature ?? 1.0),
  };
  const response = await generateJokeResponse(jokeParams);
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
