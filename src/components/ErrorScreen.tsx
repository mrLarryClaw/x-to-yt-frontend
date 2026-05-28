interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export default function ErrorScreen({ message, onRetry, onBack }: ErrorScreenProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EF4444]/20">
        <svg className="h-10 w-10 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
      <p className="max-w-xs text-sm text-[#94A3B8]">{message}</p>

      <div className="flex w-full flex-col gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-[#3B82F6] font-semibold text-white transition hover:bg-[#2563EB] min-h-[56px]"
          >
            Retry
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-[#16213E] font-medium text-white transition hover:bg-[#0F3460] min-h-[56px]"
          >
            Go back
          </button>
        )}
      </div>
    </div>
  );
}
