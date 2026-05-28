'use client';

import { useRef, useEffect, useState } from 'react';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function UrlInput({ value, onChange, error, placeholder = 'Paste X post URL...', autoFocus = true }: UrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pasted, setPasted] = useState(false);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text.trim());
      setPasted(true);
      setTimeout(() => setPasted(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          inputMode="url"
          enterKeyHint="go"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 bg-[#0F3460] px-4 py-4 pr-20 text-base text-white outline-none transition focus:border-[#3B82F6] min-h-[56px] ${
            error ? 'border-[#EF4444]' : 'border-transparent'
          }`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#94A3B8] hover:text-white active:bg-white/10"
              aria-label="Clear"
            >
              ✕
            </button>
          )}
          {!value && (
            <button
              type="button"
              onClick={handlePaste}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pasted ? 'bg-[#22C55E] text-white' : 'bg-[#16213E] text-[#94A3B8] hover:text-white'
              }`}
            >
              {pasted ? 'Pasted' : 'Paste'}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
