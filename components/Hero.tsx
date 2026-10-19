'use client';

import React, { useState } from 'react';
import { Search, Calendar, Store, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Users, Layers, QrCode } from 'lucide-react';

interface HeroProps {
  onSearchEvents: (query: string, city: string) => void;
  onSearchVendors: (category: string, city: string) => void;
  onNavigateToSection: (sectionId: string) => void;
}

export default function Hero({ onSearchEvents, onSearchVendors, onNavigateToSection }: HeroProps) {
  const [searchTab, setSearchTab] = useState<'events' | 'vendors'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Abuja');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === 'events') {
      onSearchEvents(searchQuery, selectedCity);
      onNavigateToSection('experience');
    } else {
      onSearchVendors(searchQuery, selectedCity);
      onNavigateToSection('marketplace');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f9f8fe] via-white to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-100">
      {/* Background Decorative Accents with #301d6e and #8ec82d */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#8ec82d]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 -ml-20 w-96 h-96 rounded-full bg-[#301d6e]/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#301d6e]/5 border border-[#301d6e]/15 text-[#301d6e] text-xs sm:text-sm font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#8ec82d]"></span>
            <span>EVENTORY NEXUS LIMITED</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-[#301d6e]">PLAN • BOOK • EXPERIENCE</span>
          </div>

          {/* Main Value Proposition */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#301d6e] tracking-tight leading-[1.15]">
            One Unified Platform For{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-[#301d6e]">Everything Events</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#8ec82d]/30 -rotate-1 -z-10 rounded"></span>
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Stop juggling WhatsApp groups, Google Forms, Excel spreadsheets, Instagram DMs, and bank transfers.
            <strong className="text-[#301d6e] font-semibold"> Eventory</strong> connects organizers, attendees, and verified service providers in Nigeria across one trusted digital operating system.
          </p>

          {/* The 3 Core Pillars Interactive Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-3xl mx-auto text-left">
            <div 
              onClick={() => onNavigateToSection('workspace')}
              className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#301d6e] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#301d6e] bg-[#301d6e]/5 px-2.5 py-0.5 rounded-md">
                  A. PLAN
                </span>
                <Layers className="w-4 h-4 text-[#301d6e] group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#301d6e]">Event Workspace</h4>
              <p className="text-xs text-slate-500 mt-1">Guest tracking, tasks, budget, invoices & team collaboration.</p>
            </div>

            <div 
              onClick={() => onNavigateToSection('marketplace')}
              className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#8ec82d] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#2d580f] bg-[#8ec82d]/20 px-2.5 py-0.5 rounded-md">
                  B. BOOK
                </span>
                <Store className="w-4 h-4 text-[#75a723] group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#301d6e]">Verified Marketplace</h4>
              <p className="text-xs text-slate-500 mt-1">Venues, Caterers, Decorators, Media, Sound & Ushers in Abuja.</p>
            </div>

            <div 
              onClick={() => onNavigateToSection('experience')}
              className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#301d6e] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#301d6e] bg-[#301d6e]/5 px-2.5 py-0.5 rounded-md">
                  C. EXPERIENCE
                </span>
                <Calendar className="w-4 h-4 text-[#301d6e] group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#301d6e]">Ticketing & Discovery</h4>
              <p className="text-xs text-slate-500 mt-1">Digital QR tickets, instant registration, and live gate scanning.</p>
            </div>
          </div>

          {/* Unified Search Engine */}
          <div className="max-w-3xl mx-auto pt-4">
            <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-lg shadow-[#301d6e]/5 border border-slate-200">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5 px-2">
                <button
                  type="button"
                  onClick={() => setSearchTab('events')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    searchTab === 'events'
                      ? 'bg-[#301d6e] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Discover Events</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab('vendors')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    searchTab === 'vendors'
                      ? 'bg-[#301d6e] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Book Event Services</span>
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchTab === 'events'
                        ? 'Search tech summits, concerts, weddings, workshops...'
                        : 'Search caterers, venues, decorators, DJs, security, buses...'
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#301d6e] focus:bg-white transition-all"
                  />
                </div>

                {/* City Selector */}
                <div className="relative min-w-[140px]">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#301d6e]" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#301d6e] appearance-none cursor-pointer"
                  >
                    <option value="Abuja">Abuja (Pilot Hub)</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="All">All Cities</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#301d6e]/20 hover:scale-[1.01]"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4 text-[#8ec82d]" />
                </button>
              </form>

              {/* Quick Suggestion Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 text-xs text-slate-500 px-2">
                <span className="font-medium text-slate-400">Popular:</span>
                {searchTab === 'events' ? (
                  <>
                    <button type="button" onClick={() => onSearchEvents('Tech', selectedCity)} className="hover:text-[#301d6e] hover:underline font-medium">Abuja Tech Summit</button>
                    <span>•</span>
                    <button type="button" onClick={() => onSearchEvents('Food', selectedCity)} className="hover:text-[#301d6e] hover:underline font-medium">Food Expo</button>
                    <span>•</span>
                    <button type="button" onClick={() => onSearchEvents('Wedding', selectedCity)} className="hover:text-[#301d6e] hover:underline font-medium">Bridal Showcase</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => onSearchVendors('Catering', selectedCity)} className="hover:text-[#301d6e] hover:underline font-medium">Caterers (Jollof & Grills)</button>
                    <span>•</span>
                    <button type="button" onClick={() => onSearchVendors('Venues', selectedCity)} className="hover:text-[#301d6e] hover:underline font-medium">Abuja Marquees</button>
                    <span>•</span>
                    <button type="button" onClick={() => onSearchVendors('Decoration', selectedCity)} className="hover:text-[#301d6e] hover:underline font-medium">3D Stage Decor</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Social Proof & Metrics Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium border-t border-slate-100 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8ec82d]" />
              <span>100% Verified Identity & CAC Records</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8ec82d]" />
              <span>Milestone & Quotation Escrow Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#8ec82d]" />
              <span>Instant Digital QR Passes & Gate Check-in</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
