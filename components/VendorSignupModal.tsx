'use client';

import React, { useState } from 'react';
import { X, Store, ShieldCheck, CheckCircle2, Upload, FileText, Sparkles, Building2 } from 'lucide-react';
import { VendorItem } from '../types';

interface VendorSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorRegistered: (newVendor: VendorItem) => void;
}

export default function VendorSignupModal({ isOpen, onClose, onVendorRegistered }: VendorSignupModalProps) {
  if (!isOpen) return null;

  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<VendorItem['category']>('Catering');
  const [city, setCity] = useState<VendorItem['city']>('Abuja');
  const [address, setAddress] = useState('');
  const [priceFrom, setPriceFrom] = useState(350000);
  const [guestCapacity, setGuestCapacity] = useState('100 – 1,000 guests');
  const [cacNumber, setCacNumber] = useState('RC-1849204');
  const [description, setDescription] = useState('');
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !address) {
      alert('Please fill in your business name and address.');
      return;
    }

    const newVendor: VendorItem = {
      id: `vnd-${Date.now().toString().slice(-4)}`,
      businessName,
      category,
      city,
      locationAddress: address,
      guestCapacity,
      priceFrom,
      rating: 5.0,
      reviewsCount: 1,
      responseRate: '100% within 1 hour',
      verified: true,
      cacRegistered: true,
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
      ],
      description: description || 'Verified Nigerian professional event vendor on Eventory Nexus.',
      servicesIncluded: ['Full setup & teardown', 'Dedicated on-site supervisor', 'Milestone escrow contract protection'],
      bookedCount: 0
    };

    onVendorRegistered(newVendor);
    setIsDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#301d6e] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8ec82d]/20 text-[#8ec82d] text-xs font-bold uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>Eventory Marketplace Partner</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Join the Verified Vendor Network
          </h3>
          <p className="text-xs text-purple-200 mt-1">
            Reach corporate planners, weddings, and summit organizers in Abuja and across Nigeria with guaranteed escrow payouts.
          </p>
        </div>

        {/* Content */}
        {!isDone ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered Business Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Royal Crystal Marquee & Decor"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Service Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VendorItem['category'])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                >
                  <option value="Catering">Catering & Banquets</option>
                  <option value="Venues">Event Venues & Marquees</option>
                  <option value="Decoration">Decoration & Florals</option>
                  <option value="Photography">Photography & Drone Media</option>
                  <option value="Sound & DJ">Sound & DJ Services</option>
                  <option value="Security">Security & VIP Marshals</option>
                  <option value="Transportation">Executive Buses & Car Hire</option>
                  <option value="Ushers & Support">Ushers & Event Staff</option>
                  <option value="MCs">Master of Ceremonies (MC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CAC / Corporate Reg Number *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={cacNumber}
                    onChange={(e) => setCacNumber(e.target.value)}
                    placeholder="RC-XXXXXXX or BN-XXXXXXX"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operational City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as VendorItem['city'])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                >
                  <option value="Abuja">Abuja (Primary Pilot Hub)</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physical Office / Studio Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Maitama Commercial Zone, Abuja"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Base Starting Price (₦ NGN)
                </label>
                <input
                  type="number"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guest Capacity Scope
                </label>
                <input
                  type="text"
                  value={guestCapacity}
                  onChange={(e) => setGuestCapacity(e.target.value)}
                  placeholder="e.g. 50 – 1,000 guests"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Overview of Services & Specialties
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight what sets your business apart (e.g. 500kVA dual generator, cinema 4K cameras, artisanal menu)."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
              ></textarea>
            </div>

            {/* Trust note */}
            <div className="p-3 bg-purple-50 rounded-xl flex items-center gap-2.5 text-xs text-[#301d6e]">
              <ShieldCheck className="w-4 h-4 text-[#8ec82d] shrink-0" />
              <span>
                All vendors undergo identity and CAC verification to ensure high trust for corporate and private organizers.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-sm rounded-xl shadow-md shadow-[#301d6e]/20 transition-all flex items-center justify-center gap-2 border-b-2 border-[#8ec82d]"
            >
              <Store className="w-4 h-4 text-[#8ec82d]" />
              <span>Submit Profile for Verification</span>
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#8ec82d]/20 text-[#557917] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#75a723]" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">
                Vendor Profile Registered!
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your business has been added with an <strong>Eventory Verified Status</strong> and is now discoverable by event organisers in the <strong>Book Marketplace</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl"
            >
              Explore Marketplace
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
