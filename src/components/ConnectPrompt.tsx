interface ConnectPromptProps {
  onConnect: () => void;
}

export default function ConnectPrompt({ onConnect }: ConnectPromptProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6 py-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#16213E]">
        <svg className="h-10 w-10 text-[#EF4444]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white">Connect your YouTube account</h2>
      <p className="max-w-xs text-sm text-[#94A3B8]">
        Sign in with Google to save X videos to your private YouTube library.
      </p>
      <button
        onClick={onConnect}
        className="mt-2 flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-[#1A1A2E] transition hover:bg-gray-100 min-h-[56px]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Connect YouTube
      </button>
    </div>
  );
}
