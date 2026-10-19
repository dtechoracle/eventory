'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import QuoteModal from '../../components/QuoteModal';
import VendorSignupModal from '../../components/VendorSignupModal';
import GateScannerModal from '../../components/GateScannerModal';
import { useEventory } from '../../context/EventoryContext';
import { formatNaira } from '../../lib/utils';
import { VendorItem } from '../../types';
import { 
  Store, Search, MapPin, Users, Star, Clock, ShieldCheck, 
  Check, ArrowRight, ArrowUpDown, RotateCcw, Filter, Plus, ChevronDown 
} from 'lucide-react';

export default function MarketplacePage() {
  const { vendors, requestVendorQuote, registerVendor, checkInGuest } = useEventory();
  const [selectedVendorForQuote, setSelectedVendorForQuote] = useState<VendorItem | null>(null);
  const [isVendorSignupOpen, setIsVendorSignupOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState<'all' | 'small' | 'large'>('all');
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

    // Capacity filter
    if (capacityFilter === 'small') {
      if (v.guestCapacity?.includes('1,000') || v.guestCapacity?.includes('1,500') || v.guestCapacity?.includes('5,000')) return false;
    } else if (capacityFilter === 'large') {
      if (!v.guestCapacity?.includes('1,000') && !v.guestCapacity?.includes('1,500') && !v.guestCapacity?.includes('5,000') && !v.guestCapacity?.includes('2,500')) return false;
    }

    return true;
  });

  // Sorting
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
    (selectedCategory !== 'All' ? 1 : 0) +
    (capacityFilter !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedCategory('All');
    setCapacityFilter('all');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans w-full overflow-x-hidden">
      <Navbar onOpenGateScanner={() => setIsScannerOpen(true)} />

      {/* Clean White Page Header (No ugly grey box) */}
      <div className="border-b border-slate-100 py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#301d6e] bg-purple-50 px-2.5 py-1 rounded-md">
                Verified Vendor Directory
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Hire trusted professionals for your next event
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Connect with verified caterers, decorators, photographers, venues and DJs in Abuja and Lagos with milestone escrow protection.
              </p>
            </div>

            <button
              onClick={() => setIsVendorSignupOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#301d6e] hover:bg-[#20134e] text-white shadow-2xs transition-all shrink-0 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-[#8ec82d]" />
              <span>List Your Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filter Toolbar (Crisp white design) */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 mb-8 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors by name, service or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            {/* City */}
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

            {/* Capacity Scope */}
            <div className="md:col-span-2 relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value as any)}
                className="w-full pl-9 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none cursor-pointer"
              >
                <option value="all">Any Capacity</option>
                <option value="small">Intimate (&lt;150)</option>
                <option value="large">Grand (500+)</option>
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
                <option value="rating">Top Rated</option>
                <option value="popular">Most Booked</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#301d6e] text-white shadow-xs'
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
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>

        </div>

        {/* Results Banner */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <span>Showing <strong>{sortedVendors.length}</strong> verified event {sortedVendors.length === 1 ? 'provider' : 'providers'}</span>
          <span>CAC Verified • Escrow Protected</span>
        </div>

        {/* Vendors Grid */}
        {sortedVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <Link href={`/marketplace/${vendor.id}`} className="block relative h-48 w-full bg-slate-100 overflow-hidden group">
                    <img
                      src={vendor.image}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#301d6e] text-white shadow-xs">
                        {vendor.category}
                      </span>
                    </div>

                    {vendor.verified && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#8ec82d] text-[#1e1144] shadow-xs flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#1e1144]" />
                          CAC Verified
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#8ec82d] text-[#8ec82d]" />
                      <span>{vendor.rating}</span>
                      <span className="text-slate-300 text-[10px] font-normal">({vendor.reviewsCount} reviews)</span>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-4 space-y-2.5">
                    <Link href={`/marketplace/${vendor.id}`}>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1 hover:text-[#301d6e] transition-colors">
                        {vendor.businessName}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-[#301d6e] shrink-0" />
                      <span>{vendor.locationAddress}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                      {vendor.guestCapacity && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {vendor.guestCapacity}
                        </span>
                      )}
                      <span className="bg-purple-50 text-[#301d6e] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {vendor.responseRate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {vendor.description}
                    </p>

                    {/* Services Included */}
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

                {/* Footer */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting From</span>
                    <span className="text-base font-black text-[#301d6e]">
                      {formatNaira(vendor.priceFrom)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/marketplace/${vendor.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => setSelectedVendorForQuote(vendor)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#301d6e] hover:bg-[#20134e] text-white transition-colors cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#301d6e] flex items-center justify-center mx-auto mb-3">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No vendors match your filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, selecting another Nigerian city, or clearing categories.
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

      {/* Quote Request Modal */}
      {selectedVendorForQuote && (
        <QuoteModal
          vendor={selectedVendorForQuote}
          onClose={() => setSelectedVendorForQuote(null)}
          onSubmitQuote={(q) => {
            requestVendorQuote(selectedVendorForQuote, {
              eventType: 'Event Scope Request',
              date: '2027-12-15',
              guestCount: 250,
              requirements: q.details,
              contactName: 'Event Organizer',
              phone: '+234 800 000 0000',
              email: 'organizer@eventory.ng'
            });
          }}
        />
      )}

      {/* Vendor Signup Modal */}
      {isVendorSignupOpen && (
        <VendorSignupModal
          isOpen={isVendorSignupOpen}
          onClose={() => setIsVendorSignupOpen(false)}
          onVendorRegistered={(v: VendorItem) => {
            registerVendor(v);
            setIsVendorSignupOpen(false);
          }}
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
