'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GateScannerModal from '../../components/GateScannerModal';
import { useEventory } from '../../context/EventoryContext';
import { 
  Search, MapPin, Calendar, 
  RotateCcw, ChevronDown, SlidersHorizontal, X, Check
} from 'lucide-react';

export default function EventsDiscoveryPage() {
  const { events, checkInGuest } = useEventory();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceType, setPriceType] = useState<'All' | 'Free' | 'Paid'>('All');

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

    return true;
  });

  const activeFilterCount = 
    (selectedCity !== 'All' ? 1 : 0) + 
    (selectedCategory !== 'All' ? 1 : 0) + 
    (priceType !== 'All' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedCategory('All');
    setPriceType('All');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans w-full overflow-x-hidden">
      <Navbar onOpenGateScanner={() => setIsScannerOpen(true)} />

      {/* Clean Page Header (No pills, minimal typography) */}
      <div className="bg-white border-b border-slate-100 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Events in Nigeria
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Find and experience upcoming conferences, concerts, exhibitions, and social gatherings in Abuja, Lagos, and Port Harcourt.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* MOBILE SEARCH & FILTER BAR (On the same line, filter opens modal) */}
        <div className="sm:hidden mb-6 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Open filters"
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
              activeFilterCount > 0
                ? 'bg-[#301d6e] border-[#301d6e] text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8ec82d] text-[#1e1144] text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* DESKTOP SEARCH & FILTERS (Preserved exactly for desktop screens) */}
        <div className="hidden sm:block space-y-4 mb-6">
          <div className="grid grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="col-span-8 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, venue, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] focus:bg-white transition-all"
              />
            </div>

            {/* City Selector */}
            <div className="col-span-4 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#301d6e]" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#301d6e] focus:bg-white appearance-none cursor-pointer transition-all"
              >
                <option value="All">All Cities (Nigeria)</option>
                <option value="Abuja">Abuja, Nigeria</option>
                <option value="Lagos">Lagos, Nigeria</option>
                <option value="Port Harcourt">Port Harcourt, Nigeria</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Category Pills & Price Filter */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Category horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#301d6e] text-white shadow-2xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Type toggle & Reset */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center bg-slate-50 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
                {(['All', 'Paid', 'Free'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceType(p)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
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
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ({activeFilterCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
          <span>Showing <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}</span>
          <span>Abuja • Lagos • Port Harcourt</span>
        </div>

        {/* CLEAN, DECONGESTED EVENT CARDS (Matching requested UI: Image on right, Left: truncated title + date & time underneath, same height, zero clutter) */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Right: Square Thumbnail */}
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
              className="mt-4 px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </main>

      {/* MOBILE FILTER MODAL / BOTTOM SHEET */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
          <div 
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="text-xs font-bold text-[#301d6e] bg-purple-50 px-2 py-0.5 rounded-full">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* City Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'All', label: 'All Cities' },
                  { value: 'Abuja', label: 'Abuja' },
                  { value: 'Lagos', label: 'Lagos' },
                  { value: 'Port Harcourt', label: 'Port Harcourt' }
                ].map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setSelectedCity(c.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      selectedCity === c.value
                        ? 'bg-[#301d6e] text-white border-[#301d6e]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#301d6e] text-white shadow-2xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Price
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['All', 'Paid', 'Free'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriceType(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      priceType === p
                        ? 'bg-[#8ec82d] text-[#1e1144] border-[#8ec82d]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs text-center cursor-pointer"
              >
                Show {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

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
