'use client';

import React from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { Megaphone, Mail, Share2, Sparkles, Copy, Check } from 'lucide-react';
import { useEventory } from '../../../context/EventoryContext';

export default function DashboardMarketingPage() {
  const { showToast } = useEventory();

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('https://eventory.nexus/events');
    showToast('✓ Share link copied to clipboard!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Marketing & Promotion
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Boost event visibility, reach verified attendees, and trigger invitation campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email Broadcast Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#301d6e] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Attendee Email Broadcast</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Send updates, logistics guides, and parking directions to all confirmed ticket holders with 1 click.
              </p>
            </div>
            <button
              onClick={() => showToast('Email blast queued for all registered guests!')}
              className="px-4 py-2 bg-[#301d6e] text-white font-bold text-xs rounded-xl hover:bg-[#20134e] transition-colors cursor-pointer"
            >
              Compose Broadcast
            </button>
          </div>

          {/* Social Share Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#301d6e] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Social Sharing Link</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Share your branded event page link across Instagram, WhatsApp, Twitter/X, and LinkedIn.
              </p>
            </div>
            <button
              onClick={handleCopyInvite}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Public Link
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
