'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import QuoteModal from '../../components/QuoteModal';
import { useEventory } from '../../context/EventoryContext';
import { formatNaira } from '../../lib/utils';
import { VendorItem } from '../../types';
import { 
  Store, Search, MapPin, Users, Star, ShieldCheck, 
  Check, ArrowRight, RotateCcw, Filter, ChevronDown, 
  Briefcase, CheckCircle2, Sparkles, Building2
} from 'lucide-react';

export default function VendorDirectoryPage() {
  const { vendors, requestVendorQuote } = useEventory();
  const [selectedVendorForQuote, setSelectedVendorForQuote] = useState<VendorItem | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'popular'>('rating');

  const categories = [
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

  // Filter vendors
  const filteredVendors = vendors.filter((v) => {
    // Search
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = v.businessName.toLowerCase().includes(q);
      const matchCat = v.category.toLowerCase().includes(q);
      const matchDesc = v.description.toLowerCase().includes(q);
      const matchLoc = v.locationAddress.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc && !matchLoc) return false;
    }

    // City
    if (selectedCity !== 'All' && v.city !== selectedCity) return false;

    // Category
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;

    return true;
  });

  // Sort vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.priceFrom - b.priceFrom;
    if (sortBy === 'price_desc') return b.priceFrom - a.priceFrom;
    if (sortBy === 'popular') return b.bookedCount - a.bookedCount;
    return 0;
  });

  const activeFilterCount = 
    (searchQuery ? 1 : 0) + 
    (selectedCity !== 'All' ? 1 : 0) + 
    (selectedCategory !== 'All' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedCategory('All');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans w-full overflow-x-hidden">
      <Navbar />

      {/* Clean Page Header */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Verified Event Vendors & Services
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Discover and hire pre-vetted venues, caterers, decorators, photographers, and audio engineers in Abuja, Lagos, and Port Harcourt. Secured with milestone escrow payments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/vendor"
                className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                Go to Vendor Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filter Bar (Pure White, NO grey) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors by service, name, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            {/* City Selector */}
            <div className="sm:col-span-4 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#301d6e]" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none cursor-pointer"
              >
                <option value="All">All Cities (Nigeria)</option>
                <option value="Abuja">Abuja, Nigeria</option>
                <option value="Lagos">Lagos, Nigeria</option>
                <option value="Port Harcourt">Port Harcourt, Nigeria</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#301d6e] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Banner */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <span>Showing <strong>{sortedVendors.length}</strong> verified {sortedVendors.length === 1 ? 'vendor' : 'vendors'}</span>
          <span>Abuja • Lagos • Port Harcourt</span>
        </div>

        {/* Vendor Cards Grid (3 Columns Desktop, 1 Column Mobile) */}
        {sortedVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Vendor Banner Image */}
                  <Link href={`/marketplace/${vendor.id}`} className="relative block h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={vendor.image}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-xs text-[#301d6e]">
                        {vendor.category}
                      </span>
                    </div>

                    {vendor.cacRegistered && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#8ec82d] text-[#1e1144] flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3 stroke-[3]" /> CAC Verified
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Vendor Info Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/marketplace/${vendor.id}`}>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-[#301d6e] transition-colors leading-snug line-clamp-1">
                          {vendor.businessName}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#8ec82d] text-[#8ec82d]" />
                        <span>{vendor.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({vendor.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{vendor.locationAddress}, {vendor.city}</span>
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {vendor.servicesIncluded.slice(0, 3).map((srv, idx) => (
                        <span key={idx} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {srv}
                        </span>
                      ))}
                      {vendor.servicesIncluded.length > 3 && (
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md">
                          +{vendor.servicesIncluded.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTAs */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
                  <div className="pt-3">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Rates Starting</span>
                    <strong className="text-sm font-black text-slate-900">
                      {formatNaira(vendor.priceFrom)}
                    </strong>
                  </div>

                  <div className="pt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedVendorForQuote(vendor)}
                      className="px-3.5 py-2 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Request Quote
                    </button>
                    <Link
                      href={`/marketplace/${vendor.id}`}
                      className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
                      title="View vendor profile"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Store className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-900">No vendors found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any service providers matching your query. Try clearing your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#301d6e] text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      <Footer />

      {/* Quote Request Modal */}
      {selectedVendorForQuote && (
        <QuoteModal
          vendor={selectedVendorForQuote}
          onClose={() => setSelectedVendorForQuote(null)}
          onSubmitQuote={(q) => {
            requestVendorQuote(selectedVendorForQuote, {
              eventType: q.category,
              date: 'Upcoming Event',
              guestCount: 300,
              requirements: q.details,
              contactName: 'Organizer',
              phone: '+234 800 000 0000',
              email: 'organizer@eventory.nexus'
            });
            setSelectedVendorForQuote(null);
          }}
        />
      )}

    </div>
  );
}
