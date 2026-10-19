'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEventory } from '../../context/EventoryContext';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { currentUser } = useEventory();

  useEffect(() => {
    if (currentUser.role === 'creator') {
      router.replace('/dashboard/events');
    } else if (currentUser.role === 'vendor') {
      router.replace('/dashboard/vendor');
    } else {
      router.replace('/dashboard/events');
    }
  }, [currentUser.role, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#301d6e] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading your {currentUser.role} dashboard...</p>
      </div>
    </div>
  );
}
