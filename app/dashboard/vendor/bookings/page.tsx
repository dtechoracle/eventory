'use client';

import React from 'react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../../context/EventoryContext';
import { formatNaira } from '../../../../lib/utils';
import { Calendar, MapPin, CheckCircle2, ShieldCheck, Clock, Download, ExternalLink } from 'lucide-react';

export default function VendorBookingsPage() {
  const { vendorBookings, showToast } = useEventory();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Confirmed Bookings & Escrow Contracts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your signed service agreements, event delivery schedules, and milestone payouts.
          </p>
        </div>

        {/* Bookings List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vendorBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-slate-300 transition-all shadow-2xs relative"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    {b.bookingStatus === 'confirmed' ? '✓ Agreement Signed' : b.bookingStatus.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1 line-clamp-1">{b.eventTitle}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Client: {b.clientName}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Contract</span>
                  <strong className="text-base font-black text-[#301d6e]">
                    {formatNaira(b.amount)}
                  </strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Date: {b.date}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">Venue: {b.venue}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#8ec82d]" />
                  <span>Deposit Escrowed (100% Secured)</span>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`✓ Service Agreement for ${b.eventTitle} downloaded`)}
                  className="text-xs font-bold text-[#301d6e] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Contract PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
