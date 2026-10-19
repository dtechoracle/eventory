'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrganiserRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/workspace');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#301d6e] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Redirecting to Event Workspace...</p>
      </div>
    </div>
  );
}
