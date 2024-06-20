"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";

export default function Home() {
  const { messages, input, reload, isLoading } = useChat({
    // reload() does nothing if there are no messages.
    initialMessages: [{ role: "system", content: "unused", id: "unused" }],
  });

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      reload();
    },
    [reload],
  );

  const jokes = messages.filter((m) => m.role !== "system");

  return (
    <main className="flex min-h-screen flex-col items-center justify-centter p-24">
      {jokes.map((m) => (
        <p key={m.id} className="mb-4">
          {m.content}
        </p>
      ))}
      <form onSubmit={handleSubmit}>
        <button type="submit">Generate</button>
      </form>
    </main>
  );
}
