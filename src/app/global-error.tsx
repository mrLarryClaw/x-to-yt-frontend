'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#1A1A2E] text-white antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-[#94A3B8]">
            {error?.message || 'An unexpected error occurred.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2563EB]"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-xl bg-[#16213E] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0F3460]"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}