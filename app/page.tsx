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

  const buttonContent = isLoading ? (
    <svg
      aria-hidden="true"
      className="w-4 h-4 mx-1 animate-spin fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  ) : (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 12H5m14 0-4 4m4-4-4-4"
      />
    </svg>
  );

  return (
    <main className="p-4 md:p-24">
      <h2 className="text-slate-900 dark:text-slate-50 font-bold mb-2 text-center">
        jokegpt
      </h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
        <div className="flex">
          <select
            id="category"
            name="category"
            className="flex-shrink-0 z-10 inline-flex items-center text-sm font-medium text-center text-slate-900 bg-slate-100 border border-slate-300 rounded-s-lg hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:ring-slate-700 dark:text-white dark:border-slate-600 cursor-pointer"
          >
            {JOKE_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <div className="relative w-full">
            <input
              id="topic"
              name="topic"
              placeholder="Joke topic (e.g. dogs)"
              className="block p-2 w-full z-20 text-sm text-slate-900 bg-slate-50 rounded-e-lg border-s-slate-50 border-s-2 border border-l-0 border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-s-slate-700  dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute top-0 end-0 p-1 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 dark:border-teal-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-teal-500 dark:hover:bg-teal-300 dark:focus:ring-teal-600"
            >
              {buttonContent}
            </button>
          </div>
        </div>
      </form>
      {joke && (
        <p className="mb-4 mx-auto max-w-lg whitespace-pre-wrap text-slate-800 dark:text-slate-50">
          {joke.content}
        </p>
      )}
    </main>
  );
}
