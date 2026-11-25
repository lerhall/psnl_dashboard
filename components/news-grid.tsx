"use client";

import { useState } from "react";

// How many stories show at first, and how many each "Show more" press adds.
const INITIAL_COUNT = 6;
const STEP = 4;

/** A story already formatted on the server (labels computed there). */
export type NewsCardData = {
  link: string;
  title: string;
  summary: string;
  topicLabel: string;
  meta: string;
};

/**
 * Grid of story cards. Shows 6, then each "Show more" press reveals 4 more.
 * Once everything is visible the button disappears. The parent passes a
 * `key` tied to the active filter, so switching filter resets back to 6.
 */
export function NewsGrid({ stories }: { stories: NewsCardData[] }) {
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const shown = stories.slice(0, visible);
  const remaining = stories.length - shown.length;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((story) => (
          <li key={story.link} className="flex flex-col rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-xs text-muted">
              <span className="font-medium text-accent">{story.topicLabel}</span> · {story.meta}
            </p>
            <a href={story.link} target="_blank" rel="noreferrer" className="font-medium leading-snug hover:underline">
              {story.title}
            </a>
            {story.summary && <p className="mt-2 line-clamp-3 text-sm text-muted">{story.summary}</p>}
          </li>
        ))}
      </ul>

      {/* Only rendered while there are hidden stories left */}
      {remaining > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Show {Math.min(STEP, remaining)} more ({remaining} left)
          </button>
        </div>
      )}
    </>
  );
}
