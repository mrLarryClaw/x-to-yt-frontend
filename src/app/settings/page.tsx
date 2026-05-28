'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, clearSession, isAuthenticated } from '@/lib/auth';
import { logout } from '@/lib/api';
import { User } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/');
      return;
    }
    setUser(getUser());
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      clearSession();
      router.replace('/');
    }
  };

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
        <h1 className="text-lg font-semibold text-white">Settings</h1>
      </header>

      <div className="flex flex-col gap-4 rounded-xl bg-[#16213E] p-4">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3460] text-lg font-bold text-white">
              {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="font-medium text-white">{user?.displayName || 'Unknown'}</p>
            <p className="text-sm text-[#94A3B8]">{user?.email || ''}</p>
          </div>
        </div>

        <div className="rounded-lg bg-[#0F3460]/60 p-3">
          <p className="text-xs text-[#94A3B8]">
            Only authorized Google accounts can use this app.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-[#EF4444] font-semibold text-white transition hover:bg-red-600 disabled:bg-red-900 min-h-[56px]"
        >
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </main>
  );
}
