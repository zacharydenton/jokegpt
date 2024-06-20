import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();
const model = process.env.OPENAI_MODEL || "gpt-4o";

type GenerateJokeParams = {
  type: string;
  topic: string;
  temperature: number;
};

function jokePrompt({ type, topic }: GenerateJokeParams) {
  return `Tell me a ${type} joke about ${topic}.`;
}

function generateJokeResponse(params: GenerateJokeParams) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are the funniest person in the universe. You know how to tell all kinds of jokes. When the user asks for a joke, respond only with the joke. Do not include any commentary.",
    },
    {
      role: "user",
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
    type: data.type ?? "oneliner",
    topic: data.topic ?? "programming",
    temperature: Number(data.temperature ?? 1.0),
  };
  const response = await generateJokeResponse(jokeParams);
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
