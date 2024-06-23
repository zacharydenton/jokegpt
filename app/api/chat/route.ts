import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { OpenAIStream, StreamingTextResponse } from "ai";

import WOCKA from "./wocka.json";
const JOKES = WOCKA.reduce((group, joke) => {
  const { category } = joke;
  group[category] = group[category] ?? [];
  group[category].push(joke);
  return group;
}, {});

const openai = new OpenAI();
const model = process.env.OPENAI_MODEL || "gpt-4o";

type GenerateJokeParams = {
  category: string;
  topic: string;
  temperature: number;
};

function randomJokes(category: string, maxChars: number) {
  let charCount = 0;
  const result = [];
  const jokes = JOKES[category] ?? JOKES["One Liners"];
  let offset = Math.floor(Math.random() * jokes.length);
  while (charCount < maxChars) {
    const { body } = jokes[offset];
    result.push(body);
    charCount += body.length;
    offset = (offset + 1) % jokes.length;
  }
  return result;
}

function jokePrompt({ category, topic }: GenerateJokeParams) {
  const exampleJokes = randomJokes(category, 2000);
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
