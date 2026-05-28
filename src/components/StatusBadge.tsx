import { JobStatus } from '@/types';

const statusConfig: Record<JobStatus, { label: string; color: string; bg: string }> = {
  queued: { label: 'Queued', color: 'text-[#94A3B8]', bg: 'bg-[#16213E]' },
  downloading: { label: 'Downloading...', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/20' },
  uploading: { label: 'Uploading...', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/20' },
  completed: { label: 'Done', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/20' },
  failed: { label: 'Failed', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/20' },
};

interface StatusBadgeProps {
  status: JobStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.queued;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  );
}
