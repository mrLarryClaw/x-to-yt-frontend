'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import { getJob, retryJob } from '@/lib/api';
import { Job } from '@/types';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const loadJob = useCallback(async () => {
    if (!id) return;
    try {
      const j = await getJob(id);
      setJob(j);
      if (j.status === 'completed' || j.status === 'failed') {
        clearPoll();
      }
    } catch {
      setError('Could not load job');
      clearPoll();
    } finally {
      setLoading(false);
    }
  }, [id, clearPoll]);

  useEffect(() => {
    loadJob();
    clearPoll();
    pollRef.current = setInterval(() => {
      loadJob();
    }, 2000);
    return () => clearPoll();
  }, [loadJob, clearPoll]);

  const handleRetry = async () => {
    if (!id) return;
    setRetrying(true);
    setError('');
    try {
      const j = await retryJob(id);
      setJob(j);
      clearPoll();
      pollRef.current = setInterval(() => {
        loadJob();
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  if (loading && !job) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F3460] border-t-[#3B82F6]" />
        <p className="text-sm text-[#94A3B8]">Loading...</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4">
        <p className="text-[#EF4444]">Job not found</p>
        <button
          onClick={() => router.push('/history')}
          className="rounded-xl bg-[#16213E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0F3460]"
        >
          Back to history
        </button>
      </main>
    );
  }

  const progress = Math.min(100, Math.max(0, job.progressPercent || 0));

  return (
    <main className="flex min-h-full flex-col gap-4">
      <header className="flex items-center gap-2 pt-4">
        <button
          onClick={() => router.push('/history')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition active:bg-white/10"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-white">Job</h1>
      </header>

      <div className="flex flex-col gap-4 rounded-xl bg-[#16213E] p-4">
        <div>
          <p className="text-xs text-[#94A3B8]">Source</p>
          <p className="mt-1 break-all text-sm text-white">{job.sourceUrl}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-[#94A3B8]">Status</p>
          <StatusBadge status={job.status} />
        </div>

        {(job.status === 'downloading' || job.status === 'uploading') && (
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded-full bg-[#0F3460]">
              <div
                className="h-3 rounded-full bg-[#3B82F6] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-xs text-[#94A3B8]">{progress}%</p>
          </div>
        )}

        {job.youtubeUrl && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#94A3B8]">YouTube</p>
            <a
              href={job.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-[#3B82F6] underline"
            >
              {job.youtubeUrl}
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(job.youtubeUrl!)}
                className="flex-1 rounded-lg bg-[#0F3460] px-3 py-2 text-sm text-white transition hover:bg-[#3B82F6]"
              >
                Copy link
              </button>
              <a
                href={job.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center rounded-lg bg-[#EF4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Open
              </a>
            </div>
          </div>
        )}

        {job.errorMessage && (
          <div className="rounded-lg bg-[#EF4444]/10 p-3">
            <p className="text-sm text-[#EF4444]">{job.errorMessage}</p>
          </div>
        )}

        {job.status === 'failed' && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-[#3B82F6] font-semibold text-white transition hover:bg-[#2563EB] disabled:bg-[#0F3460] disabled:text-[#94A3B8] min-h-[56px]"
          >
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-[#EF4444]">{error}</p>}
    </main>
  );
}
