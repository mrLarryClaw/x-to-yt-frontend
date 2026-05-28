'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UrlInput from '@/components/UrlInput';
import SubmitButton from '@/components/SubmitButton';
import SuccessScreen from '@/components/SuccessScreen';
import ErrorScreen from '@/components/ErrorScreen';
import ConnectPrompt from '@/components/ConnectPrompt';
import { isAuthenticated, initSessionFromSearchParams, getUser } from '@/lib/auth';
import { buildStartAuthUrl, createJob, getJob, isValidXUrl } from '@/lib/api';
import { Job } from '@/types';

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [auth, setAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initSessionFromSearchParams();
    const ok = isAuthenticated();
    setAuth(ok);
    if (ok) {
      setUserName(getUser()?.displayName || '');
    }
    const p = searchParams.get('auth');
    if (p === 'rejected') {
      setError('Your Google account is not allowed to use this app.');
    }
  }, [searchParams]);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (initialJob: Job) => {
      setJob(initialJob);
      clearPoll();
      let retries = 0;
      pollRef.current = setInterval(async () => {
        try {
          const j = await getJob(initialJob.id);
          setJob(j);
          if (j.status === 'completed' || j.status === 'failed') {
            clearPoll();
          }
          retries = 0;
        } catch {
          retries += 1;
          if (retries >= 3) clearPoll();
        }
      }, 2000);
    },
    [clearPoll]
  );

  useEffect(() => {
    return () => clearPoll();
  }, [clearPoll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidXUrl(url)) {
      setError('Enter a valid X or Twitter post URL like https://x.com/.../status/...');
      return;
    }
    setLoading(true);
    try {
      const created = await createJob({ sourceUrl: url });
      startPolling(created);
      setUrl('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if (!auth) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">X to YouTube</h1>
        <ConnectPrompt onConnect={() => (window.location.href = buildStartAuthUrl())} />
      </main>
    );
  }

  if (job?.status === 'completed' && job.youtubeUrl) {
    return (
      <main className="flex min-h-full flex-col items-center gap-4">
        <div className="w-full pt-4">
          <h1 className="text-xl font-bold text-white">X to YouTube</h1>
          <p className="text-xs text-[#94A3B8]">Signed in as {userName}</p>
        </div>
        <SuccessScreen
          youtubeUrl={job.youtubeUrl}
          onSubmitAnother={() => setJob(null)}
        />
        <button
          onClick={() => router.push('/history')}
          className="w-full rounded-xl bg-[#16213E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0F3460]"
        >
          View history
        </button>
      </main>
    );
  }

  if (job?.status === 'failed') {
    return (
      <main className="flex min-h-full flex-col items-center gap-4">
        <div className="w-full pt-4">
          <h1 className="text-xl font-bold text-white">X to YouTube</h1>
          <p className="text-xs text-[#94A3B8]">Signed in as {userName}</p>
        </div>
        <ErrorScreen
          message={job.errorMessage || 'Upload failed. You can retry from the job detail.'}
          onBack={() => setJob(null)}
          onRetry={() => router.push(`/job/${job.id}`)}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-col gap-6">
      <div className="w-full pt-4">
        <h1 className="text-xl font-bold text-white">X to YouTube</h1>
        <p className="text-xs text-[#94A3B8]">Signed in as {userName}</p>
      </div>
      {job && (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-[#16213E] p-6 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F3460] border-t-[#3B82F6]" />
          <p className="text-sm font-medium text-white capitalize">{job.status}</p>
          <p className="text-xs text-[#94A3B8]">Polling every 2s...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <UrlInput value={url} onChange={setUrl} error={error} />
        <SubmitButton
          label="Save to YouTube"
          loading={loading}
          disabled={!url || loading}
        />
      </form>
      <div className="flex gap-2">
        <button
          onClick={() => router.push('/history')}
          className="flex-1 rounded-xl bg-[#16213E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0F3460]"
        >
          History
        </button>
        <button
          onClick={() => router.push('/settings')}
          className="flex-1 rounded-xl bg-[#16213E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0F3460]"
        >
          Settings
        </button>
      </div>
    </main>
  );
}
