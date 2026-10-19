'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../context/EventoryContext';
import { 
  Store, Building2, Calendar, DollarSign, CheckCircle2, 
  Clock, ShieldCheck, ArrowRight, MessageSquare, Plus 
} from 'lucide-react';
import { formatNaira } from '../../../lib/utils';

export default function VendorDashboardPage() {
  const { vendorEnquiries, vendorBookings, vendors } = useEventory();

  const myVendorProfile = vendors[0]; // Active vendor profile

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Vendor Hub
              </h1>
              <span className="text-xs font-bold text-[#8ec82d] bg-purple-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CAC Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage client inquiries, send milestone quotations, and fulfill verified event bookings.
            </p>
          </div>

          <Link
            href="/vendor"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all self-start sm:self-auto"
          >
            <span>Full Vendor Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500">Active Bookings</span>
            <div className="text-2xl font-black text-slate-900">{vendorBookings.length} Events</div>
            <span className="text-[11px] text-emerald-600 font-semibold">100% On-time delivery rate</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500">Total Contract Value</span>
            <div className="text-2xl font-black text-[#301d6e]">
              {formatNaira(vendorBookings.reduce((acc, b) => acc + b.amount, 0))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Secured via Eventory Escrow</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500">Pending Enquiries</span>
            <div className="text-2xl font-black text-amber-600">
              {vendorEnquiries.filter((e) => e.status === 'pending').length} Pending
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Average response time: 25 mins</span>
          </div>
        </div>

        {/* Client Inquiries List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Recent Client Enquiries
            </h2>
            <Link href="/vendor" className="text-xs font-bold text-[#301d6e] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {vendorEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{enq.eventTitle}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#301d6e]">
                      {enq.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Organizer: {enq.organizerName} • Date: {enq.date} • Guests: ~{enq.guestCount}
                  </p>
                  <p className="text-xs text-slate-600 italic mt-1 font-medium">"{enq.notes}"</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Est: {formatNaira(enq.budgetEstimated)}
                  </span>
                  <Link
                    href="/vendor"
                    className="px-3.5 py-1.5 bg-[#301d6e] text-white font-bold text-xs rounded-lg hover:bg-[#20134e] transition-all"
                  >
                    Respond
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
