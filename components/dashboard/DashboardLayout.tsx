'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardSidebar from './DashboardSidebar';
import { useEventory } from '../../context/EventoryContext';
import { Menu, Sparkles, X, User, Bell, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const { currentUser } = useEventory();

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans">
      
      {/* Left Sidebar */}
      <DashboardSidebar 
        mobileOpen={mobileSidebarOpen} 
        onCloseMobile={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Top Announcement Banner (Matching media_1792369670008.png) */}
        {showBanner && (
          <div className="bg-amber-50 border-b border-amber-200/60 px-4 sm:px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-3 sticky top-0 z-30">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-semibold">
                Organiser profile is here 🚀
              </span>
              <Link 
                href="/dashboard/account" 
                className="font-bold underline hover:text-amber-950 inline-flex items-center gap-0.5"
              >
                Tap here to set it up <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <button
              onClick={() => setShowBanner(false)}
              className="text-amber-600 hover:text-amber-900 p-1 rounded-md cursor-pointer shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-white border-b border-slate-100 px-4 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-1">
              <span className="text-lg font-black tracking-tight text-[#301d6e]">
                eventory
              </span>
              <span className="w-2 h-2 rounded-full bg-[#8ec82d] inline-block mb-1"></span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {currentUser.role === 'creator' ? 'Creator' : currentUser.role === 'vendor' ? 'Vendor' : 'Attendee'}
            </span>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
