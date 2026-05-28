'use client';

interface SuccessScreenProps {
  youtubeUrl: string;
  onSubmitAnother: () => void;
}

export default function SuccessScreen({ youtubeUrl, onSubmitAnother }: SuccessScreenProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(youtubeUrl);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]/20">
        <svg className="h-10 w-10 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-white">Saved to YouTube</h2>
      <p className="text-sm text-[#94A3B8]">Your video is now private on YouTube.</p>

      <div className="w-full rounded-xl bg-[#16213E] p-4">
        <p className="truncate text-sm text-[#3B82F6] underline decoration-transparent">
          {youtubeUrl}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={handleCopy}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-[#16213E] font-medium text-white transition hover:bg-[#0F3460] min-h-[56px]"
        >
          Copy link
        </button>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center rounded-xl bg-[#EF4444] font-semibold text-white transition hover:bg-red-600 min-h-[56px]"
        >
          View on YouTube
        </a>
        <button
          onClick={onSubmitAnother}
          className="mt-2 text-sm text-[#94A3B8] underline hover:text-white"
        >
          Submit another
        </button>
      </div>
    </div>
  );
}
