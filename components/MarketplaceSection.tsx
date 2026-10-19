'use client';

import React, { useState } from 'react';
import { Store, Star, MapPin, Users, ShieldCheck, Clock, Check, Send, Sparkles, Filter, Search, ArrowRight } from 'lucide-react';
import { VendorItem } from '../types';
import { formatNaira } from '../lib/utils';

interface MarketplaceSectionProps {
  vendors: VendorItem[];
  onRequestQuote: (vendor: VendorItem) => void;
  onOpenVendorSignup: () => void;
  filterCity?: string;
  categoryFilter?: string;
}

export default function MarketplaceSection({
  vendors,
  onRequestQuote,
  onOpenVendorSignup,
  filterCity = 'All',
  categoryFilter = 'All'
}: MarketplaceSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter);
  const [cityTab, setCityTab] = useState<string>(filterCity);
  const [searchQuery, setSearchQuery] = useState('');

  const vendorCategories = [
    'All',
    'Venues',
    'Catering',
    'Decoration',
    'Photography',
    'Sound & DJ',
    'Security',
    'Transportation',
    'Ushers & Support'
  ];

  const filteredVendors = vendors.filter((v) => {
    const catMatch = selectedCategory === 'All' || v.category === selectedCategory;
    const cityMatch = cityTab === 'All' || v.city === cityTab;
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !q ||
      v.businessName.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.locationAddress.toLowerCase().includes(q);

    return catMatch && cityMatch && searchMatch;
  });

  return (
    <section id="marketplace" className="py-16 bg-[#fbfaff] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#301d6e] tracking-tight">
              Hire Verified Event Venues & Vendors in Nigeria
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              No more searching on Instagram or risking unverified vendors. Compare pricing, reviews, capacities, and request binding quotations with escrow protection.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenVendorSignup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-[#301d6e] border border-[#301d6e]/20 hover:border-[#301d6e] shadow-xs transition-all hover:bg-purple-50"
            >
              <Store className="w-4 h-4 text-[#301d6e]" />
              <span>List Your Service</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 mb-8 space-y-4 shadow-xs">
          
          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {vendorCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#301d6e] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Location Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search caterers, marquees, decorators, DJs..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <span className="text-slate-500 font-medium">City Hub:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {['All', 'Abuja', 'Lagos'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCityTab(c)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      cityTab === c
                        ? 'bg-[#301d6e] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {c === 'All' ? 'All Hubs' : c}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#8ec82d] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Vendor Image Banner */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={vendor.image}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#301d6e] text-white shadow-xs">
                      {vendor.category}
                    </span>
                  </div>

                  {/* CAC Verified Pill */}
                  {vendor.verified && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#8ec82d] text-[#20134e] shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#20134e]" />
                        CAC Verified
                      </span>
                    </div>
                  )}

                  {/* Rating in banner */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#8ec82d] text-[#8ec82d]" />
                    <span>{vendor.rating}</span>
                    <span className="text-slate-300 text-[10px] font-normal">({vendor.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="p-4 space-y-2.5">
                  <h3 className="font-black text-sm text-slate-900 line-clamp-1 hover:text-[#301d6e]">
                    {vendor.businessName}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3 h-3 text-[#301d6e] shrink-0" />
                    <span>{vendor.locationAddress}</span>
                  </p>

                  {/* Metadata Chips: Capacity & Response Rate */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                    {vendor.guestCapacity && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {vendor.guestCapacity}
                      </span>
                    )}
                    <span className="bg-purple-50 text-[#301d6e] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#301d6e]" />
                      {vendor.responseRate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {vendor.description}
                  </p>

                  {/* Services highlights */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {vendor.servicesIncluded.slice(0, 2).map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <Check className="w-3 h-3 text-[#8ec82d] shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Starting Price & Quote Button */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting From</span>
                  <span className="text-base font-black text-[#301d6e]">
                    {formatNaira(vendor.priceFrom)}
                  </span>
                </div>

                <button
                  onClick={() => onRequestQuote(vendor)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#301d6e] hover:bg-[#20134e] text-white shadow-xs transition-all hover:scale-105 border-b-2 border-[#8ec82d]"
                >
                  <Send className="w-3 h-3 text-[#8ec82d]" />
                  <span>Request Quote</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Section Bottom Trust Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#301d6e] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#8ec82d]" />
            </div>
            <div>
              <h4 className="font-black text-sm sm:text-base text-slate-900">
                Are you an event vendor in Abuja, Lagos or Port Harcourt?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Join over 250+ verified businesses receiving structured requests, automated invoices, and guaranteed milestone escrow payments.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVendorSignup}
            className="whitespace-nowrap px-6 py-3 rounded-xl font-black text-xs text-white bg-[#301d6e] hover:bg-[#20134e] shadow-md shadow-[#301d6e]/20 transition-all border-b-2 border-[#8ec82d]"
          >
            Apply for Verified Listing
          </button>
        </div>

      </div>
    </section>
  );
}
