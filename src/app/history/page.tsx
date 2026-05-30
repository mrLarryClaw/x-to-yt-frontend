'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import JobRow from '@/components/JobRow';
import { getJobs } from '@/lib/api';
import { Job } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = () => {
    setLoading(true);
    setError('');
    getJobs()
      .then((data) => {
        setJobs(data);
      })
      .catch((err) => {
        console.error('Failed to load jobs:', err);
        if (err?.message?.includes('401') || err?.message?.includes('unauthorized')) {
          localStorage.removeItem('x2yt_token');
          router.push('/');
          return;
        }
        setError('Could not load history. Try logging in again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <main className="flex min-h-full flex-col gap-4">
      <header className="flex items-center gap-2 pt-4">
        <button
          onClick={() => router.push('/')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition active:bg-white/10"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-white">History</h1>
      </header>
      {loading ? (
        <div className="py-10 text-center text-[#94A3B8]">Loading...</div>
      ) : error ? (
        <div className="py-10 text-center text-[#EF4444]">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="py-10 text-center text-[#94A3B8]">No jobs yet.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <JobRow job={job} onDeleted={loadJobs} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}