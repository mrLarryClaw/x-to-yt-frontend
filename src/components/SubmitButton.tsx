interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function SubmitButton({ label, loading, disabled, onClick, type = 'submit', variant = 'primary' }: SubmitButtonProps) {
  const base = 'flex h-14 w-full items-center justify-center rounded-xl font-semibold text-base transition active:scale-[0.98] min-h-[56px] select-none';
  let colors = 'bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:bg-[#0F3460] disabled:text-[#94A3B8]';
  if (variant === 'secondary') {
    colors = 'bg-[#16213E] text-white hover:bg-[#0F3460] disabled:bg-[#16213E] disabled:text-[#94A3B8]';
  }
  if (variant === 'danger') {
    colors = 'bg-[#EF4444] text-white hover:bg-red-600 disabled:bg-red-900 disabled:text-red-200';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${colors}`}
      aria-busy={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Queued...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
