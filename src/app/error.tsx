'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
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
    </main>
  );
}