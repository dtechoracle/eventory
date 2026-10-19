'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import GateScannerModal from './GateScannerModal';
import TicketModal from './TicketModal';
import { useEventory } from '../context/EventoryContext';
import { formatNaira } from '../lib/utils';
import { 
  Calendar, Clock, MapPin, Users, ShieldCheck, Ticket, 
  ChevronRight, ArrowLeft, Share2, CheckCircle2, 
  HelpCircle, ExternalLink, Download, Check
} from 'lucide-react';

export default function EventDetailClient({ id }: { id: string }) {
  const { events, purchaseTicket, checkInGuest } = useEventory();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const event = events.find((e) => e.id === id);
  if (!event) {
    notFound();
  }

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const handleGetTicketClick = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans w-full overflow-x-hidden">
      <Navbar onOpenGateScanner={() => setIsScannerOpen(true)} />

      {/* Breadcrumbs (Exact Tix format: Discover / Event Title) */}
      <div className="border-b border-slate-100 py-3 text-xs bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-500">
          <Link href="/events" className="hover:text-[#301d6e]">Discover</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold truncate max-w-sm sm:max-w-xl">{event.title}</span>
        </div>
      </div>

      {/* Main Event Page Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Vertical Poster + "Get a Ticket" CTA (Removed Pepsi/Sterling/Kuda strip per request) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Portrait Event Poster */}
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-100 relative group">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#301d6e] text-white shadow-xs">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Prominent "Get a Ticket" Button (Navigates to dedicated tickets & checkout page) */}
            <Link
              href={`/events/${event.id}/tickets`}
              className="w-full py-4 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-2 border-b-4 border-[#8ec82d]"
            >
              <Ticket className="w-4 h-4 text-[#8ec82d]" />
              <span>Get a Ticket</span>
            </Link>

            {/* Host Information Quick Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#301d6e] text-white flex items-center justify-center font-bold text-xs">
                  {event.organizer.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Host</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    {event.organizer}
                    {event.organizerVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8ec82d]" />
                    )}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="p-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Share Event"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Title + Metadata + About + Ticket Tiers + Directions (Removed Never Miss An Event) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Event Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Metadata Rows with Icons */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{event.date}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{event.venue}, {event.city}, {event.state}</span>
              </div>
            </div>

            {/* Thin Divider */}
            <hr className="border-slate-100 my-6" />

            {/* About This Event */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">About this event</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Available Ticket Options (Direct on-page view for instant accessibility) */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Ticket Options</h3>
                <span className="text-xs text-slate-400">{event.ticketTiers.length} tier(s) available</span>
              </div>

              <div className="space-y-2.5">
                {event.ticketTiers.map((tier) => (
                  <Link
                    key={tier.id}
                    href={`/events/${event.id}/tickets`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#301d6e] hover:shadow-2xs transition-all flex items-center justify-between cursor-pointer bg-white group"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#301d6e] transition-colors">{tier.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-[#301d6e]">
                        {formatNaira(tier.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">per ticket</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Event Schedule (if provided) */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-slate-900">Program & Agenda</h3>
                <div className="space-y-2">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-mono font-bold text-[#301d6e] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.time}
                      </span>
                      <div>
                        <strong className="text-slate-900 font-semibold">{item.title}</strong>
                        {item.description && <p className="text-slate-500 mt-0.5">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thin Divider */}
            <hr className="border-slate-100 my-6" />

            {/* Directions & Venue Location */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Directions</h2>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#301d6e] hover:underline flex items-center gap-1"
                >
                  Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Clean Map View Mockup */}
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                  alt="Venue Map Location"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
                
                {/* Pin Card */}
                <div className="relative z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-200/80 shadow-md text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#301d6e] text-white flex items-center justify-center mx-auto shadow-xs">
                    <MapPin className="w-4 h-4 text-[#8ec82d]" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{event.venue}</h4>
                  <p className="text-[11px] text-slate-500">{event.city}, Nigeria</p>
                </div>
              </div>
            </div>

            {/* Refund & Entry Policy */}
            {event.refundPolicy && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs mt-6">
                <span className="font-bold text-slate-800 block uppercase text-[10px] tracking-wider">Refund & Entry Policy</span>
                <p className="text-slate-600 leading-relaxed">{event.refundPolicy}</p>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />

      {/* Tix.africa Exact Checkout Modal */}
      {isCheckoutOpen && (
        <TicketModal
          event={event}
          onClose={() => setIsCheckoutOpen(false)}
          onTicketPurchased={(info) => {
            purchaseTicket(event, event.ticketTiers[0].id, 1, {
              name: info.attendeeName,
              email: info.email,
              phone: info.phone
            });
          }}
          onOpenScannerWithTicket={() => setIsScannerOpen(true)}
        />
      )}

      {/* Gate Scanner */}
      {isScannerOpen && (
        <GateScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          guests={[]}
          onCheckInGuest={checkInGuest}
        />
      )}

    </div>
  );
}
