'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import GateScannerModal from '../../../components/GateScannerModal';
import { useEventory } from '../../../context/EventoryContext';
import { QrCode, Search, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';

export default function DashboardBoxOfficePage() {
  const { workspace, checkInGuest } = useEventory();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [ticketInput, setTicketInput] = useState('');
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const checkedInCount = workspace.guests.filter((g) => g.checkedIn).length;
  const totalGuests = workspace.guests.length;

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    const res = checkInGuest(ticketInput.trim());
    setVerifyMessage(res.message);
    setTicketInput('');
    setTimeout(() => setVerifyMessage(null), 5000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Box Office & Gate Scanner
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify attendee credentials, scan QR entry passes, and monitor real-time door admissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <QrCode className="w-4 h-4 text-[#8ec82d]" />
            <span>Launch Camera Scanner</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500">Admitted at Gate</span>
            <div className="text-2xl font-black text-slate-900">{checkedInCount} / {totalGuests}</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#8ec82d] h-full rounded-full transition-all"
                style={{ width: `${Math.round((checkedInCount / (totalGuests || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500">Awaiting Arrival</span>
            <div className="text-2xl font-black text-amber-600">{totalGuests - checkedInCount}</div>
            <span className="text-[11px] text-slate-400">Pre-registered tickets</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500">Gate Status</span>
            <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Access
            </div>
            <span className="text-[11px] text-slate-400">Door scanners online</span>
          </div>
        </div>

        {/* Manual Code Check-In */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Manual Ticket Code Entry
          </h3>
          <form onSubmit={handleManualCheckIn} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. EVT-101-VIP-8849"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono uppercase font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Verify Pass
            </button>
          </form>

          {verifyMessage && (
            <div className="p-3 bg-purple-50 text-[#301d6e] border border-purple-100 rounded-xl text-xs font-bold animate-in fade-in">
              {verifyMessage}
            </div>
          )}
        </div>

        {/* Guest registry preview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Recent Admissions
            </h3>
            <span className="text-xs text-slate-400">{workspace.guests.length} Registered</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {workspace.guests.map((g) => (
              <div key={g.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{g.name}</h4>
                  <span className="text-slate-500 font-mono text-[11px]">{g.ticketCode} • {g.ticketType}</span>
                </div>
                <div className="text-right">
                  {g.checkedIn ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Admitted ({g.checkInTime || 'Gate'})
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Awaiting
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {isScannerOpen && (
        <GateScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          guests={workspace.guests}
          onCheckInGuest={checkInGuest}
        />
      )}
    </DashboardLayout>
  );
}
