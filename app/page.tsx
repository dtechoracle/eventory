'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TicketModal from '../components/TicketModal';
import GateScannerModal from '../components/GateScannerModal';
import CreateEventModal from '../components/CreateEventModal';
import { useEventory } from '../context/EventoryContext';
import { formatNaira } from '../lib/utils';
import { EventItem } from '../types';
import { 
  Calendar, MapPin, Search, ArrowRight, ShieldCheck, Ticket, Users, 
  Store, CheckCircle2, Star, Clock, Layers, ChevronDown, ChevronRight, 
  ChevronLeft, Check, Sparkles, SlidersHorizontal, Smartphone, Zap
} from 'lucide-react';

export default function HomePage() {
  const { events, vendors, workspace, checkInGuest, purchaseTicket, createEvent } = useEventory();

  // Modals state
  const [selectedEventForTickets, setSelectedEventForTickets] = useState<EventItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Carousel ref for smooth programmatic scroll
  const carouselRef = useRef<HTMLDivElement>(null);

  // Discovery filtering state
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [activePriceFilter, setActivePriceFilter] = useState('All');
  const [activeDateFilter, setActiveDateFilter] = useState('All');

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtered popular events for the clean 2-column list
  const filteredEvents = events.filter((evt) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = evt.title.toLowerCase().includes(q) ||
                    evt.venue.toLowerCase().includes(q) ||
                    evt.city.toLowerCase().includes(q) ||
                    evt.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCity !== 'All' && evt.city !== selectedCity) return false;
    if (activeCategoryFilter !== 'All' && evt.category !== activeCategoryFilter) return false;
    if (activePriceFilter === 'Free' && evt.startingPrice > 0) return false;
    if (activePriceFilter === 'Paid' && evt.startingPrice === 0) return false;
    if (activeDateFilter === 'Weekend') {
      const isWeekend = evt.date.includes('Saturday') || evt.date.includes('Sunday');
      if (!isWeekend) return false;
    }
    return true;
  });

  // Highlighted events for the wide carousel
  const highlightedEvents = events.slice(0, 6);

  const categories = [
    'All',
    'Tech & Business',
    'Festival',
    'Music & Concert',
    'Social & Wedding',
    'Conference',
    'Workshops'
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans w-full overflow-x-hidden">
      
      {/* 1. CLEAN NAVIGATION */}
      <Navbar
        onOpenGateScanner={() => setIsScannerOpen(true)}
        onOpenCreateEvent={() => setIsCreateModalOpen(true)}
      />

      <main className="flex-1 w-full overflow-x-hidden">
        
        {/* 2. FULL PHOTOGRAPHIC HERO */}
        <section className="relative w-full h-[440px] sm:h-[500px] lg:h-[560px] bg-slate-950 flex items-center justify-center text-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2000&q=80"
            alt="Live concert crowd"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

          {/* Centered Hero Typography (Removed fake pilot badge, buttons side by side on mobile) */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Discover an experience to remember
            </h1>
            <p className="text-xs sm:text-base text-slate-200 font-normal max-w-2xl mx-auto leading-relaxed">
              Explore concerts, conferences, cultural festivals, tech summits, and live events happening around you.
            </p>
            
            {/* Action buttons: side by side on mobile with concise labels */}
            <div className="pt-3 flex flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
              <Link
                href="/events"
                className="flex-1 sm:flex-none sm:px-8 py-3 bg-[#8ec82d] hover:bg-[#76a824] text-[#1e1144] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-150 shadow-sm text-center"
              >
                Discover
              </Link>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 sm:flex-none sm:px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wider rounded-xl border border-white/20 backdrop-blur-md transition-all duration-150 text-center cursor-pointer"
              >
                Host Event
              </button>
            </div>
          </div>
        </section>

        {/* 3. DISCOVERY & FILTERING (Merged cleanly without huge gap) */}
        <section className="pt-6 sm:pt-8 pb-4 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  What are you in the mood for?
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Concerts, tech conferences, banquets, and festivals across Nigeria.
                </p>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeCategoryFilter === cat
                        ? 'bg-[#301d6e] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. HIGHLIGHTED EVENTS HORIZONTAL CAROUSEL */}
        <section className="py-6 sm:py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            
            {/* Header with City Selector & Carousel Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                <span className="text-slate-500">Find an event in:</span>
                <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-[#301d6e]" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="font-bold text-slate-900 bg-transparent cursor-pointer pr-5 focus:outline-none appearance-none text-xs sm:text-sm"
                  >
                    <option value="All">All Cities (Nigeria)</option>
                    <option value="Abuja">Abuja, Nigeria</option>
                    <option value="Lagos">Lagos, Nigeria</option>
                    <option value="Port Harcourt">Port Harcourt, Nigeria</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
                </div>
              </div>

              {/* Prev / Next Carousel Navigation Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:text-[#301d6e] transition-colors shadow-2xs cursor-pointer"
                  aria-label="Previous events"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:text-[#301d6e] transition-colors shadow-2xs cursor-pointer"
                  aria-label="Next events"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Carousel */}
            <div
              ref={carouselRef}
              className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 pt-1 scroll-smooth scrollbar-none"
            >
              {highlightedEvents.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.id}`}
                  className="group relative snap-start shrink-0 w-[280px] sm:w-[350px] md:w-[380px] h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-5"
                >
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#301d6e] text-white">
                      HIGHLIGHTED
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#301d6e]" />
                      {evt.city}
                    </span>
                  </div>

                  {/* Bottom highlighted text */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="font-black text-base sm:text-lg text-white group-hover:text-[#8ec82d] transition-colors line-clamp-2 leading-snug">
                      {evt.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-[#8ec82d]" />
                      <span>{evt.date}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/15">
                      <span className="text-xs font-bold text-white">
                        {evt.startingPrice === 0 ? 'Free RSVP' : formatNaira(evt.startingPrice)}
                      </span>
                      <span className="text-xs font-bold text-[#8ec82d] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Get Ticket <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Popular Events Header */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Popular Events
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredEvents.length} events
                </p>
              </div>
              <Link href="/events" className="text-xs font-bold text-[#301d6e] hover:underline flex items-center gap-1">
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* CLEAN POPULAR EVENTS CARDS (Requested UI: Image on right, Left: truncated title + date & time underneath, no badges/price/extra buttons) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {filteredEvents.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.id}`}
                  className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-sm transition-all duration-150 flex items-center justify-between gap-4 h-24 sm:h-28"
                >
                  {/* Left: Truncated Title & Date/Time underneath */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#301d6e] transition-colors truncate leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </p>
                  </div>

                  {/* Right: Crisp Square Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Center "See all events" Button */}
            <div className="text-center pt-6">
              <Link
                href="/events"
                className="inline-block px-10 py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
              >
                See all events
              </Link>
            </div>

          </div>
        </section>

        {/* 5. ORGANISER SECTION (Replaced dummy card with authentic event photography) */}
        <section className="py-16 sm:py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Copy */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#301d6e] bg-purple-50 px-3 py-1 rounded-full">
                  Organiser Workspace
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  For first-time planners and expert organisers
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                  Set up your event in minutes, reach the right audience, manage vendor quotes, and coordinate guest check-ins with automated milestone escrow.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#301d6e] hover:bg-[#20134e] transition-all cursor-pointer"
                  >
                    Create an event
                  </button>
                  <Link
                    href="/organiser"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#301d6e] border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Explore Workspace Demo
                  </Link>
                </div>
              </div>

              {/* Right Authentic Event Photography Image (Removed dummy Stephen & Chioma card) */}
              <div className="lg:col-span-6 relative">
                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 relative h-64 sm:h-80 group">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                    alt="Event Management Experience"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8ec82d]">
                      Eventory Ecosystem
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Plan • Book • Experience
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Unified ticketing, verified vendor booking, and live gate scanning across Nigeria.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. "REAL PEOPLE, REAL RAVE REVIEWS!" */}
        <section className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-100 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Real people, real rave reviews!
            </h2>

            <div className="text-3xl sm:text-4xl font-serif text-[#301d6e]">
              “
            </div>

            <p className="text-xs sm:text-base text-slate-700 font-normal leading-relaxed max-w-xl mx-auto italic">
              "Working with Eventory has been really great because ticketing, vendor coordination and gate check-ins have become the easiest parts of our event."
            </p>

            <div className="pt-1">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                Nexus Ventures & Abuja Hospitality Guild
              </h4>
            </div>
          </div>
        </section>

        {/* 7. PARTNER BRAND LOGOS STRIP */}
        <section className="py-10 bg-white border-t border-slate-100 overflow-hidden w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400 font-mono text-xs font-bold opacity-70">
              <span className="text-slate-800 text-sm font-black">kuda.</span>
              <span>PALMWINE MUSIC</span>
              <span>HOMECOMING</span>
              <span>Sterling</span>
              <span>bamboo</span>
              <span>Eat Drink Festival</span>
              <span>ART X LAGOS</span>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />

      {/* Gate Scanner */}
      {isScannerOpen && (
        <GateScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          guests={workspace.guests}
          onCheckInGuest={checkInGuest}
        />
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onEventCreated={(ev) => {
            createEvent(ev);
            setIsCreateModalOpen(false);
          }}
        />
      )}

    </div>
  );
}
