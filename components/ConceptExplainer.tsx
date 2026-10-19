'use client';

import React from 'react';
import { Layers, ArrowRight, CheckCircle2, XCircle, ShieldCheck, Zap, TrendingUp, Building2, Smartphone, Users } from 'lucide-react';

export default function ConceptExplainer() {
  const comparisonItems = [
    {
      challenge: 'Event Registration & Tickets',
      fragmented: 'Google Forms + manual bank screenshot matching + WhatsApp PDF tickets',
      eventory: 'Self-serve branded ticketing, instant card/transfer payment, verifiable QR gate passes'
    },
    {
      challenge: 'Vendor Sourcing & Trust',
      fragmented: 'Searching Instagram hashtags, cold DMs, unverified bank deposits, risk of no-show',
      eventory: 'CAC-verified vendor marketplace, reviews, clear capacity tags, milestone escrow protection'
    },
    {
      challenge: 'Quotations & Invoicing',
      fragmented: 'Disorganized PDF quotes, Excel spreadsheets, handwritten receipts, lost invoices',
      eventory: 'Integrated quotation approvals, automated digital invoices, transparent balance tracking'
    },
    {
      challenge: 'Event Day Gate Check-in',
      fragmented: 'Printed paper lists, manual pen crossing, long entrance queues, duplicate tickets',
      eventory: 'Real-time QR scanner app with sub-second validation and instant attendance dashboards'
    },
    {
      challenge: 'Team Coordination',
      fragmented: '10 noisy WhatsApp groups with lost attachments and conflicting instructions',
      eventory: 'Unified Event Workspace with task checklists, role-based chat, and guest seat allocations'
    }
  ];

  return (
    <section id="concept" className="py-20 bg-gradient-to-b from-white via-purple-50/30 to-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#301d6e]/5 text-[#301d6e] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#8ec82d]"></span>
            <span>THE EVENTORY VISION</span>
            <span className="text-slate-300">•</span>
            <span>EVENTORY NEXUS LIMITED</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#301d6e] tracking-tight">
            More Than Just Ticketing.<br />
            An Operating System For Events.
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-normal">
            A typical ticketing platform only sells tickets. Eventory empowers the organizer to <strong>plan the entire event, hire verified service providers, manage budgets</strong>, and deliver a world-class attendee experience.
          </p>
        </div>

        {/* The Equation Card (From Concept Note) */}
        <div className="bg-[#301d6e] text-white rounded-3xl p-6 sm:p-10 shadow-2xl mb-16 relative overflow-hidden text-center border-b-4 border-[#8ec82d]">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#8ec82d] block">
              THE FRAGMENTATION EQUATION SOLVED
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-purple-200">
              <span className="bg-white/10 px-3 py-1 rounded-lg">WhatsApp</span>
              <span>+</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Google Forms</span>
              <span>+</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Excel Sheets</span>
              <span>+</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Instagram DMs</span>
              <span>+</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Bank Transfers</span>
              <span>+</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Phone Calls</span>
              <span>+</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Separate Ticketing</span>
            </div>

            <div className="py-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#8ec82d] text-[#221451] font-black text-lg">
                ↓
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                EVENTORY
              </h3>
              <p className="text-base sm:text-lg font-bold text-[#8ec82d]">
                PLAN • BOOK • EXPERIENCE
              </p>
              <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto">
                One platform. Every event. From the moment you have an idea to the moment the last guest leaves.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-16">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-black text-slate-900 text-base sm:text-lg">
                Traditional Fragmentation vs. Eventory Unified OS
              </h4>
              <p className="text-xs text-slate-500">Why leading Nigerian organizers are switching to Eventory.</p>
            </div>
            <span className="text-xs font-bold text-[#301d6e] bg-purple-100 px-3 py-1 rounded-full">
              Abuja Pilot Standard
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="md:col-span-3">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block">{item.challenge}</span>
                </div>

                <div className="md:col-span-4 flex items-start gap-2.5 text-xs text-slate-500 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item.fragmented}</span>
                </div>

                <div className="md:col-span-1 hidden md:flex justify-center text-slate-300">
                  <ArrowRight className="w-4 h-4 text-[#8ec82d]" />
                </div>

                <div className="md:col-span-4 flex items-start gap-2.5 text-xs text-slate-800 bg-[#8ec82d]/10 p-3 rounded-xl border border-[#8ec82d]/30 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#557917] shrink-0 mt-0.5" />
                  <span>{item.eventory}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The 3 Personas & Business Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#301d6e]/10 flex items-center justify-center text-[#301d6e]">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-black text-lg text-slate-900">For Organisers</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Corporates, NGOs, government agencies, universities, churches, and wedding couples get a powerful workspace to run tasks, book verified vendors, track ₦ balances, and eliminate coordination stress.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">✓ Unified Event Workspace</li>
              <li className="flex items-center gap-2">✓ Automated Invoice Approvals</li>
              <li className="flex items-center gap-2">✓ Real-time QR Gate Attendance</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8ec82d]/20 flex items-center justify-center text-[#221451]">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-black text-lg text-slate-900">For Attendees</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discover top summits, festivals, concerts, and social experiences in Abuja and across Nigeria. Instant digital ticket issuance, transparent fees, and fast-track gate check-in via mobile passes.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">✓ Discover Nigerian Events</li>
              <li className="flex items-center gap-2">✓ Instant Digital QR Passes</li>
              <li className="flex items-center gap-2">✓ 0% Platform Fee on Free Events</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#301d6e]/10 flex items-center justify-center text-[#301d6e]">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="font-black text-lg text-slate-900">For Vendors & Venues</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Showcase verified portfolios to high-intent organizers. Receive structured quote requests, automated milestone billing, and guaranteed escrow settlements without chasing clients for payments.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">✓ Verified CAC Directory Badge</li>
              <li className="flex items-center gap-2">✓ Milestone Escrow Payouts</li>
              <li className="flex items-center gap-2">✓ Direct Organiser Quote Inquiries</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
