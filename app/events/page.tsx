'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GateScannerModal from '../../components/GateScannerModal';
import TicketModal from '../../components/TicketModal';
import { useEventory } from '../../context/EventoryContext';
import { formatNaira } from '../../lib/utils';
import { EventItem } from '../../types';
import { 
  Search, MapPin, Calendar, Users, ShieldCheck, Ticket, 
  ArrowRight, RotateCcw, ArrowUpDown, ChevronDown, Clock 
} from 'lucide-react';

export default function EventsDiscoveryPage() {
  const { events, checkInGuest, purchaseTicket } = useEventory();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedEventForCheckout, setSelectedEventForCheckout] = useState<EventItem | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceType, setPriceType] = useState<'All' | 'Free' | 'Paid'>('All');
  const [datePreset, setDatePreset] = useState<'any' | 'weekend' | 'upcoming'>('any');
  const [sortBy, setSortBy] = useState<'soonest' | 'price_asc' | 'price_desc' | 'popular'>('soonest');

  const categories = [
    'All',
    'Tech & Business',
    'Festival',
    'Music & Concert',
    'Social & Wedding',
    'Conference',
    'Workshops'
  ];

  // Filtering logic
  const filteredEvents = events.filter((evt) => {
    // Search
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchVenue = evt.venue.toLowerCase().includes(q);
      const matchOrganizer = evt.organizer.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchOrganizer && !matchDesc) return false;
    }

    // City
    if (selectedCity !== 'All' && evt.city !== selectedCity) return false;

    // Category
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;

    // Price
    if (priceType === 'Free' && evt.startingPrice > 0) return false;
    if (priceType === 'Paid' && evt.startingPrice === 0) return false;

    // Date presets
    if (datePreset === 'weekend') {
      const isWeekend = evt.date.includes('Saturday') || evt.date.includes('Sunday');
      if (!isWeekend) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
    if (sortBy === 'price_desc') return b.startingPrice - a.startingPrice;
    if (sortBy === 'popular') return b.ticketsSold - a.ticketsSold;
    return a.id.localeCompare(b.id);
  });

  const activeFilterCount = 
    (searchQuery ? 1 : 0) + 
    (selectedCity !== 'All' ? 1 : 0) + 
    (selectedCategory !== 'All' ? 1 : 0) + 
    (priceType !== 'All' ? 1 : 0) + 
    (datePreset !== 'any' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedCategory('All');
    setPriceType('All');
    setDatePreset('any');
    setSortBy('soonest');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans w-full overflow-x-hidden">
      <Navbar onOpenGateScanner={() => setIsScannerOpen(true)} />

      {/* Clean Page Header (Restrained, no unnecessary cards) */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#301d6e] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#8ec82d]"></span>
              <span>Discover Events in Nigeria</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Experiences worth showing up for
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
              Explore upcoming concerts, tech summits, exhibitions, and social experiences in Abuja, Lagos, and beyond. Verified hosts and instant digital entry passes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Sleek Search & Filter Bar */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 mb-8 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, venue, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            {/* City Selector */}
            <div className="md:col-span-3 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#301d6e]" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none cursor-pointer"
              >
                <option value="All">All Cities (Nigeria)</option>
                <option value="Abuja">Abuja, Nigeria</option>
                <option value="Lagos">Lagos, Nigeria</option>
                <option value="Port Harcourt">Port Harcourt, Nigeria</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Preset */}
            <div className="md:col-span-2 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value as any)}
                className="w-full pl-9 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none cursor-pointer"
              >
                <option value="any">Any Date</option>
                <option value="weekend">This Weekend</option>
                <option value="upcoming">Upcoming</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sorting */}
            <div className="md:col-span-2 relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-9 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none cursor-pointer"
              >
                <option value="soonest">Sort: Soonest</option>
                <option value="popular">Sort: Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Categories Pill Bar & Price Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
            {/* Category horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#301d6e] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Type toggle & Reset */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
                {(['All', 'Paid', 'Free'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceType(p)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      priceType === p ? 'bg-[#8ec82d] text-[#1e1144]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ({activeFilterCount})</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <span>Showing <strong>{sortedEvents.length}</strong> {sortedEvents.length === 1 ? 'event' : 'events'}</span>
          <span>Abuja • Lagos • Port Harcourt</span>
        </div>

        {/* Clean, Decongested 2-Column Event Listings (Matching Tix UI concept) */}
        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedEvents.map((evt) => {
              const isFree = evt.startingPrice === 0;

              return (
                <div
                  key={evt.id}
                  className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all duration-200 flex items-start justify-between gap-5"
                >
                  {/* Left: Metadata */}
                  <div className="flex-1 space-y-2.5">
                    
                    {/* Category Tag & Host */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#301d6e] uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-md">
                        {evt.category}
                      </span>
                      {evt.organizerVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#8ec82d]" /> Verified Host
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <Link href={`/events/${evt.id}`}>
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#301d6e] transition-colors leading-snug line-clamp-2">
                        {evt.title}
                      </h3>
                    </Link>

                    {/* Date & Time */}
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.date}</span>
                      <span className="text-slate-300">•</span>
                      <span>{evt.time}</span>
                    </p>

                    {/* Venue Location */}
                    <p className="text-xs text-slate-500 flex items-start gap-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{evt.venue}, {evt.city}</span>
                    </p>

                    {/* Price & Checkout CTA */}
                    <div className="pt-2 flex items-center gap-3">
                      {isFree ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          Free RSVP
                        </span>
                      ) : (
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          From {formatNaira(evt.startingPrice)}
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedEventForCheckout(evt)}
                        className="text-xs font-bold text-[#301d6e] hover:text-[#1e1144] hover:underline flex items-center gap-1"
                      >
                        Get Ticket <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>

                  {/* Right: Square Thumbnail */}
                  <Link
                    href={`/events/${evt.id}`}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative shadow-2xs"
                  >
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#301d6e] flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No events found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any events matching your selected criteria. Try adjusting your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white rounded-xl text-xs font-bold transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </main>

      <Footer />

      {/* Tix-style Checkout Modal */}
      {selectedEventForCheckout && (
        <TicketModal
          event={selectedEventForCheckout}
          onClose={() => setSelectedEventForCheckout(null)}
          onTicketPurchased={(info) => {
            purchaseTicket(selectedEventForCheckout, selectedEventForCheckout.ticketTiers[0].id, 1, {
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
