import { Suspense } from 'react';
import HomeClient from './HomeClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-full bg-[#1A1A2E]" />}>
      <HomeClient />
    </Suspense>
  );
}
