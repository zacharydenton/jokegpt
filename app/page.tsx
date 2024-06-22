"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";

const JOKE_CATEGORIES = [
  "One Liners",
  "Animal",
  "At Work",
  "Bar",
  "Blond",
  "Children",
  "College",
  "Gross",
  "Insults",
  "Knock-Knock",
  "Lawyer",
  "Lightbulb",
  "Medical",
  "Men / Women",
  "News / Politics",
  "Other / Misc",
  "Puns",
  "Redneck",
  "Religious",
  "Sports",
  "Tech",
  "Yo Momma",
];

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
          <label htmlFor="category">Joke category:</label>
          <select id="category" name="category">
            {JOKE_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="topic">Joke topic:</label>
          <input id="topic" name="topic" defaultValue="dogs" />
        </div>
        <div>
          <label htmlFor="temperature">Temperature:</label>
          <input
            id="temperature"
            name="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
          />
        </div>
        <button type="submit">Generate</button>
      </form>
    </main>
  );
}
