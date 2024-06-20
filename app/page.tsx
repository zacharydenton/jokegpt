"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";

export default function Home() {
  const { messages, input, append, isLoading } = useChat();

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      append(
        { role: "system", content: "unused", id: "unused" },
        {
          data: Object.fromEntries(new FormData(e.target).entries()),
        },
      );
    },
    [append],
  );

  const jokes = messages.filter((m) => m.role !== "system");
  const joke = jokes[jokes.length - 1];

  return (
    <main className="flex min-h-screen flex-col items-center justify-centter p-24">
      {joke && <p className="mb-4">{joke.content}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Joke type:</label>
          <select id="type" name="type">
            <option>oneliner</option>
            <option>self-deprecating</option>
            <option>ironic</option>
            <option>situational</option>
            <option>observational</option>
            <option>anecdotal</option>
            <option>character</option>
            <option>deadpan</option>
            <option>farcical</option>
            <option>slapstick</option>
          </select>
        </div>
        <div>
          <label htmlFor="topic">Joke topic:</label>
          <select id="topic" name="topic">
            <option>programming</option>
            <option>AI</option>
            <option>llamas</option>
            <option>cheese</option>
            <option>sports</option>
          </select>
        </div>
        <button type="submit">Generate</button>
      </form>
    </main>
  );
}
