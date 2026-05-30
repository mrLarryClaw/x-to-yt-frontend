'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Job } from '@/types';
import StatusBadge from './StatusBadge';
import { deleteYouTubeVideo } from '@/lib/api';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

function truncateUrl(url: string, max = 60): string {
  return url.length > max ? url.slice(0, max - 3) + '...' : url;
}

interface JobRowProps {
  job: Job;
  onDeleted?: () => void;
}

export default function JobRow({ job, onDeleted }: JobRowProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  return (
    <button
      onClick={() => router.push(`/job/${job.id}`)}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#16213E] px-4 py-4 text-left transition active:bg-[#0F3460] min-h-[56px]"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">{truncateUrl(job.sourceUrl)}</p>
        <p className="mt-1 text-xs text-[#94A3B8]">{timeAgo(job.createdAt)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {job.youtubeUrl && job.status === 'completed' && (
          <>
            <a
              href={job.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-md bg-[#EF4444] px-2 py-1 text-xs font-medium text-white hover:bg-red-600 transition"
              title="Open on YouTube"
            >
              ▶ YouTube
            </a>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (!confirm('Delete this video from YouTube?')) return;
                setDeleting(true);
                try {
                  await deleteYouTubeVideo(job.id);
                  onDeleted?.();
                } catch {
                  alert('Failed to delete YouTube video');
                } finally {
                  setDeleting(false);
                }
              }}
              disabled={deleting}
              className="rounded-md bg-[#6B7280] px-2 py-1 text-xs font-medium text-white hover:bg-[#4B5563] transition disabled:opacity-50"
              title="Delete from YouTube"
            >
              {deleting ? '⋯' : '🗑'}
            </button>
          </>
        )}
        <StatusBadge status={job.status} />
      </div>
    </button>
  );
}