'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Tag, Users, ShieldCheck, Ticket, Search, Filter, Sparkles, ArrowUpRight } from 'lucide-react';
import { EventItem } from '../types';
import { formatNaira } from '../lib/utils';

interface ExperienceSectionProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  filterCity?: string;
  searchFilter?: string;
}

export default function ExperienceSection({
  events,
  onSelectEvent,
  filterCity = 'All',
  searchFilter = ''
}: ExperienceSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cityTab, setCityTab] = useState<string>(filterCity);
  const [priceType, setPriceType] = useState<'All' | 'Free' | 'Paid'>('All');
  const [internalQuery, setInternalQuery] = useState(searchFilter);

  const categories = [
    'All',
    'Tech & Business',
    'Festival',
    'Music & Concert',
    'Social & Wedding',
    'Conference',
    'Workshops'
  ];

  const filteredEvents = events.filter((evt) => {
    // Category match
    const categoryMatch = selectedCategory === 'All' || evt.category === selectedCategory;
    
    // City match
    const cityMatch = cityTab === 'All' || evt.city === cityTab;

    // Price match
    const priceMatch =
      priceType === 'All' ||
      (priceType === 'Free' && evt.startingPrice === 0) ||
      (priceType === 'Paid' && evt.startingPrice > 0);

    // Search query match
    const query = internalQuery.toLowerCase();
    const searchMatch =
      !query ||
      evt.title.toLowerCase().includes(query) ||
      evt.venue.toLowerCase().includes(query) ||
      evt.organizer.toLowerCase().includes(query) ||
      evt.description.toLowerCase().includes(query);

    return categoryMatch && cityMatch && priceMatch && searchMatch;
  });

  return (
    <section id="experience" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#301d6e]/5 text-[#301d6e] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#8ec82d]"></span>
              <span>PILLAR C • EXPERIENCE</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">Tix Discovery & Ticketing</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#301d6e] tracking-tight">
              Discover Events & Get Verified Digital Passes
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Browse top conferences, summits, and live festivals in Nigeria. Purchase in ₦ Naira with instant QR code delivery and fast-track gate entry.
            </p>
          </div>

          {/* Quick city filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full text-xs font-bold shrink-0">
            {['All', 'Abuja', 'Lagos'].map((c) => (
              <button
                key={c}
                onClick={() => setCityTab(c)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  cityTab === c
                    ? 'bg-[#301d6e] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c === 'All' ? 'All Cities' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-8 space-y-4">
          
          {/* Categories Horizontal Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#301d6e] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar & Price toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={internalQuery}
                onChange={(e) => setInternalQuery(e.target.value)}
                placeholder="Filter by keyword or venue..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <span className="text-slate-500 font-medium">Ticket Type:</span>
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200">
                {(['All', 'Paid', 'Free'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceType(p)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      priceType === p
                        ? 'bg-[#8ec82d] text-[#20134e]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const percentSold = Math.min(100, Math.round((evt.ticketsSold / evt.capacity) * 100));
              const isFree = evt.startingPrice === 0;

              return (
                <div
                  key={evt.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#301d6e]/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Event Banner Image with Overlay Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#301d6e] text-white shadow-xs">
                          {evt.category}
                        </span>
                      </div>

                      {/* City Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#301d6e]" />
                          {evt.city}
                        </span>
                      </div>

                      {/* Date Pill in bottom banner */}
                      <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8ec82d]" />
                        <span>{evt.date}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      
                      {/* Host & Verification */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1 truncate">
                          <span className="truncate">{evt.organizer}</span>
                          {evt.organizerVerified && (
                            <span title="Verified Organizer">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#8ec82d] shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{evt.time}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-black text-base text-slate-900 group-hover:text-[#301d6e] transition-colors line-clamp-2 leading-snug">
                        {evt.title}
                      </h3>

                      {/* Venue */}
                      <p className="text-xs text-slate-600 flex items-start gap-1.5 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{evt.venue}</span>
                      </p>

                      {/* Short Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Attendance capacity meter */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            {evt.ticketsSold} registered
                          </span>
                          <span className="font-semibold text-slate-700">{percentSold}% booked</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#301d6e] to-[#8ec82d] rounded-full transition-all duration-500"
                            style={{ width: `${percentSold}%` }}
                          ></div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Footer with Price & CTA */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {isFree ? 'Admission' : 'Starting From'}
                      </span>
                      <span className={`text-lg font-black ${isFree ? 'text-emerald-600' : 'text-[#301d6e]'}`}>
                        {formatNaira(evt.startingPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectEvent(evt)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#301d6e] group-hover:bg-[#20134e] text-white shadow-xs group-hover:shadow-md transition-all hover:scale-105 border-b-2 border-[#8ec82d]"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#8ec82d]" />
                      <span>{isFree ? 'Claim Free RSVP' : 'Get Tickets'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-sm">No events match your current filter.</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the city or category filter above.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setCityTab('All'); setPriceType('All'); setInternalQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#301d6e] text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
