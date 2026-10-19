'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../context/EventoryContext';
import { Ticket, QrCode, Calendar, MapPin, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { formatNaira } from '../../../lib/utils';

export default function AttendeeTicketsPage() {
  const { workspace, lastConfirmedTicket } = useEventory();

  const mockTickets = [
    ...(lastConfirmedTicket ? [{
      code: lastConfirmedTicket.ticketCode,
      title: lastConfirmedTicket.eventTitle,
      date: lastConfirmedTicket.eventDate,
      time: lastConfirmedTicket.eventTime,
      venue: lastConfirmedTicket.venue,
      tier: lastConfirmedTicket.ticketTierName,
      status: 'Valid for Entry',
      attendee: lastConfirmedTicket.attendeeName
    }] : []),
    {
      code: 'EVT-8849-ABJ',
      title: 'Annual Tech Summit Abuja',
      date: 'Nov 14, 2027',
      time: '09:00 AM',
      venue: 'The Dome, Central Business District, Abuja',
      tier: 'VIP Executive Pass',
      status: 'Valid for Entry',
      attendee: 'Ezekiel Adeleke'
    },
    {
      code: 'EVT-2914-LOS',
      title: 'Lagos Cultural & Culinary Carnival',
      date: 'Dec 05, 2027',
      time: '12:00 PM',
      venue: 'Muri Okunola Park, Victoria Island, Lagos',
      tier: 'General Admission',
      status: 'Valid for Entry',
      attendee: 'Ezekiel Adeleke'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Tickets & Passes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your digital entry passes, QR codes, and gate credentials.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all self-start sm:self-auto"
          >
            <span>Discover more events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockTickets.map((t) => (
            <div
              key={t.code}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-slate-300 transition-all shadow-2xs relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#301d6e] bg-purple-50 px-2 py-0.5 rounded-md">
                    {t.tier}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1 line-clamp-1">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.date} • {t.time}</span>
                  </p>
                </div>

                <div className="w-14 h-14 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center shrink-0 text-[#301d6e]">
                  <QrCode className="w-7 h-7" />
                  <span className="text-[8px] font-mono font-bold mt-0.5">SCAN</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pass Code</span>
                  <span className="font-mono font-black text-slate-800">{t.code}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Attendee</span>
                  <span className="font-bold text-slate-800">{t.attendee}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  ● {t.status}
                </span>

                <button
                  type="button"
                  onClick={() => alert(`Downloading pass ${t.code}...`)}
                  className="flex items-center gap-1 text-xs font-bold text-[#301d6e] hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
