'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../context/EventoryContext';
import { 
  Plus, Filter, Calendar, Ticket, Edit3, Copy, 
  ExternalLink, Search, CheckCircle2, MoreVertical, 
  MessageCircle, Sparkles, MapPin, ChevronDown
} from 'lucide-react';

export default function DashboardEventsPage() {
  const { events, showToast } = useEventory();
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter events by tab and search
  const filteredEvents = events.filter((evt) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = evt.title.toLowerCase().includes(q) || evt.venue.toLowerCase().includes(q);
      if (!match) return false;
    }
    // City filter
    if (filterCity !== 'All' && evt.city !== filterCity) return false;

    // Tabs
    if (activeTab === 'drafts') return evt.ticketsSold === 0;
    if (activeTab === 'ended') return false; // mock events are active/upcoming
    return true;
  });

  const handleCopyLink = (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard?.writeText(url);
    showToast(`✓ Public event link copied to clipboard!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Top Header Row (Matching media_1792369670008.png) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Events
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your published experiences, track ticket sales, and configure attendance.
            </p>
          </div>

          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create event</span>
          </Link>
        </div>

        {/* Tabs & Filter Bar (Matching media_1792369670008.png) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-1">
          {/* Status Tabs */}
          <div className="flex items-center gap-6 text-xs font-bold">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'published', label: 'Published' },
              { id: 'drafts', label: 'Drafts' },
              { id: 'ended', label: 'Ended' }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 relative transition-colors cursor-pointer ${
                    active ? 'text-[#301d6e] font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#301d6e] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filter Action */}
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your events..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] w-48 sm:w-56 transition-all"
              />
            </div>

            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Filter by City</span>
                {['All', 'Abuja', 'Lagos', 'Port Harcourt'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setFilterCity(c);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                      filterCity === c ? 'bg-[#301d6e] text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Event Cards Grid (2 columns, matching media_1792369670008.png) */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex items-start gap-4 relative"
              >
                {/* Left: Event Banner Thumbnail */}
                <Link
                  href={`/events/${evt.id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative block"
                >
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Right: Content details */}
                <div className="flex-1 min-w-0 space-y-1.5 pr-8">
                  {/* Physical / Virtual Tag */}
                  <span className="text-[11px] font-semibold text-rose-600 block">
                    {evt.city === 'Online' ? 'Virtual' : 'Physical'}
                  </span>

                  {/* Title */}
                  <Link href={`/events/${evt.id}`}>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#301d6e] transition-colors line-clamp-1 leading-snug">
                      {evt.title}
                    </h3>
                  </Link>

                  {/* Date */}
                  <p className="text-xs text-slate-500 font-medium">
                    {evt.date}
                  </p>

                  {/* Ticket Sales Count */}
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.ticketsSold} {evt.ticketsSold === 1 ? 'Ticket' : 'Tickets'} Sold</span>
                  </div>
                </div>

                {/* Top Right Card Actions (Pencil & Link icon) */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-slate-400">
                  <Link
                    href={`/events/${evt.id}`}
                    title="View public event page"
                    className="p-1.5 hover:text-[#301d6e] hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, evt.id)}
                    title="Copy share link"
                    className="p-1.5 hover:text-[#301d6e] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#301d6e] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No events found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't created any events under this tab yet. Start hosting your next experience now.
              </p>
            </div>
            <Link
              href="/dashboard/events/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#301d6e] text-white font-bold text-xs rounded-xl hover:bg-[#20134e] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create your first event</span>
            </Link>
          </div>
        )}

      </div>

      {/* Floating Support Chat Trigger (Bottom right, matching media_1792369670008.png) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => showToast('Eventory Host Support: Contact us anytime at support@eventory.nexus')}
          className="w-12 h-12 rounded-full bg-[#301d6e] hover:bg-[#20134e] text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
          aria-label="Support chat"
        >
          <MessageCircle className="w-6 h-6 text-[#8ec82d]" />
        </button>
      </div>

    </DashboardLayout>
  );
}
