'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Star, Users, MapPin, Send, Clock, Sparkles } from 'lucide-react';
import { VendorItem } from '../types';
import { formatNaira } from '../lib/utils';

interface QuoteModalProps {
  vendor: VendorItem | null;
  onClose: () => void;
  onSubmitQuote: (quote: {
    vendorName: string;
    category: string;
    quotedAmount: number;
    details: string;
  }) => void;
}

export default function QuoteModal({ vendor, onClose, onSubmitQuote }: QuoteModalProps) {
  if (!vendor) return null;

  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('2027-12-15');
  const [guestCount, setGuestCount] = useState(450);
  const [requirements, setRequirements] = useState('');
  const [organizerName, setOrganizerName] = useState('Stephen Adeleke');
  const [organizerPhone, setOrganizerPhone] = useState('+234 803 234 5678');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details = `${eventType} for ~${guestCount} guests on ${eventDate}. Notes: ${requirements || 'Standard event scope requested.'}`;
    
    onSubmitQuote({
      vendorName: vendor.businessName,
      category: vendor.category,
      quotedAmount: vendor.priceFrom,
      details
    });

    setIsSubmitted(true);
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

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#8ec82d]/20 text-[#8ec82d]">
              {vendor.category}
            </span>
            {vendor.verified && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-[#8ec82d]" />
                CAC Verified
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {vendor.businessName}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-purple-200 mt-2">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#8ec82d] text-[#8ec82d]" />
              <strong>{vendor.rating}</strong> ({vendor.reviewsCount} reviews)
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8ec82d]" />
              {vendor.responseRate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8ec82d]" />
              {vendor.city}
            </span>
          </div>
        </div>

        {/* Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Vendor Pricing & Capacity Banner */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Estimate</span>
                <span className="text-base font-black text-[#301d6e]">
                  From {formatNaira(vendor.priceFrom)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity Range</span>
                <span className="font-bold text-slate-700 flex items-center gap-1 justify-end">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {vendor.guestCapacity || 'Flexible'}
                </span>
              </div>
            </div>

            {/* Event Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Category / Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                >
                  <option value="Wedding Reception">Wedding Reception</option>
                  <option value="Corporate Conference">Corporate Conference</option>
                  <option value="Annual Gala Dinner">Annual Gala Dinner</option>
                  <option value="Government Summit">Government Summit</option>
                  <option value="Concert / Festival">Concert / Festival</option>
                  <option value="Private Celebration">Private Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proposed Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Number of Guests
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
              />
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Requirements / Custom Notes
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Multi-course Nigerian banquet with live grill station, Jollof, small chops for 450 guests in Maitama."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
              ></textarea>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organiser Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone (WhatsApp)
                </label>
                <input
                  type="tel"
                  required
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
            </div>

            {/* Trust disclaimer */}
            <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl text-[11px] text-[#301d6e]">
              <Sparkles className="w-4 h-4 text-[#8ec82d] shrink-0" />
              <span>
                Eventory Escrow Guarantee: Payments are only disbursed upon approved milestone deliverables.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-sm rounded-xl shadow-md shadow-[#301d6e]/20 transition-all flex items-center justify-center gap-2 border-b-2 border-[#8ec82d]"
            >
              <Send className="w-4 h-4 text-[#8ec82d]" />
              <span>Send Quotation Request</span>
            </button>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#8ec82d]/20 text-[#557917] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#75a723]" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">
                Quote Request Dispatched!
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {vendor.businessName} typically responds within {vendor.responseRate}.
                This request has also been synchronized into your <strong>Eventory Workspace</strong> for unified tracking.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-800">{vendor.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Scope:</span>
                <span className="font-bold text-slate-800">{guestCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Workspace Status:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Pending Vendor Response
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all"
            >
              Done & Return
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
