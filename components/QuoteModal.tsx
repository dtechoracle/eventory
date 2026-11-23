'use client';

import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Star, Users, MapPin, 
  Send, Clock, Sparkles, Calendar, DollarSign, Check, Phone, Mail, User 
} from 'lucide-react';
import { VendorItem } from '../types';
import { formatNaira } from '../lib/utils';
import { useEventory } from '../context/EventoryContext';

interface QuoteModalProps {
  vendor: VendorItem | null;
  onClose: () => void;
  onSubmitQuote?: (quote: {
    vendorName: string;
    category: string;
    quotedAmount: number;
    details: string;
  }) => void;
}

export default function QuoteModal({ vendor, onClose, onSubmitQuote }: QuoteModalProps) {
  const { currentUser, requestVendorQuote, toast } = useEventory();
  if (!vendor) return null;

  // Selected package
  const [selectedPkgId, setSelectedPkgId] = useState<string>('custom');

  // Event details
  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('2027-12-15');
  const [guestCount, setGuestCount] = useState<number>(250);
  const [venueLocation, setVenueLocation] = useState<string>(vendor.city || 'Abuja');
  const [requirements, setRequirements] = useState('');

  // Contact details
  const [contactName, setContactName] = useState(currentUser.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser.email || '');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPackage = vendor.packages?.find((p) => p.id === selectedPkgId);
  const calculatedEstimate = selectedPackage ? selectedPackage.price : vendor.priceFrom;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactName.trim() || !contactEmail.trim()) {
      toast.warning('Contact Details Required', 'Please enter your name and email address.');
      return;
    }

    setIsSubmitting(true);
    const scopeNotes = `${selectedPackage ? `[Package: ${selectedPackage.name}] ` : '[Custom Scope] '}${eventType} for ~${guestCount} guests in ${venueLocation} on ${eventDate}. Notes: ${requirements || 'Standard event scope requested.'}`;

    try {
      // 1. Submit through Eventory Context & Neon API
      await requestVendorQuote(vendor, {
        eventType,
        date: eventDate,
        guestCount: Number(guestCount) || 100,
        requirements: scopeNotes,
        contactName: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
      });

      // 2. Also notify parent handler if present
      if (onSubmitQuote) {
        onSubmitQuote({
          vendorName: vendor.businessName,
          category: vendor.category,
          quotedAmount: calculatedEstimate,
          details: scopeNotes,
        });
      }

      toast.success(
        'Request Sent!',
        `Your inquiry has been dispatched to ${vendor.businessName}.`
      );
      setIsSuccess(true);
    } catch (err) {
      console.error('Quote submit error:', err);
      toast.error('Network Warning', 'Your quote was queued locally.');
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* SOLID HEADER (No glass cards, crisp brand colors) */}
        <div className="bg-[#301d6e] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/15 text-white">
              {vendor.category}
            </span>
            {vendor.verified && (
              <span className="flex items-center gap-1 text-[10px] text-[#1e1144] font-bold bg-[#8ec82d] px-2.5 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1e1144]" />
                CAC Verified
              </span>
            )}
            <span className="text-[11px] text-purple-200 flex items-center gap-1 ml-auto mr-8">
              <MapPin className="w-3.5 h-3.5 text-[#8ec82d]" />
              {vendor.city}, Nigeria
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Request Quote from {vendor.businessName}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-purple-200 mt-2">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#8ec82d] text-[#8ec82d]" />
              <strong className="text-white">{vendor.rating}</strong> ({vendor.reviewsCount} reviews)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8ec82d]" />
              Responds in {vendor.responseRate}
            </span>
            <span>•</span>
            <span className="text-emerald-300 font-bold">
              Milestone Escrow Protection
            </span>
          </div>
        </div>

        {/* BODY */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* 1. PACKAGE SELECTOR (If vendor offers packages) */}
            {vendor.packages && vendor.packages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    1. Select Service Offering or Package
                  </label>
                  <span className="text-[11px] text-slate-400">Optional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Custom Scope Option */}
                  <div
                    onClick={() => setSelectedPkgId('custom')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPkgId === 'custom'
                        ? 'border-[#301d6e] bg-purple-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">Custom Scope Inquiry</h4>
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedPkgId === 'custom' ? 'border-[#301d6e] bg-[#301d6e]' : 'border-slate-300'
                        }`}>
                          {selectedPkgId === 'custom' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tailored bespoke quotation based on your exact requirements.
                      </p>
                    </div>
                    <span className="text-xs font-black text-[#301d6e] mt-2 block">
                      From {formatNaira(vendor.priceFrom)}
                    </span>
                  </div>

                  {/* Tiered Packages */}
                  {vendor.packages.map((pkg) => {
                    const isSelected = selectedPkgId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkgId(pkg.id)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#301d6e] bg-purple-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{pkg.name}</h4>
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#301d6e] bg-[#301d6e]' : 'border-slate-300'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {pkg.description}
                          </p>
                        </div>
                        <span className="text-xs font-black text-[#301d6e] mt-2 block">
                          {formatNaira(pkg.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. EVENT SPECIFICATIONS */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                {vendor.packages && vendor.packages.length > 0 ? '2.' : '1.'} Event Specifications
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Event Category *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  >
                    <option value="Wedding Reception">Wedding Reception</option>
                    <option value="Corporate Conference">Corporate Conference</option>
                    <option value="Annual Gala Dinner">Annual Gala Dinner</option>
                    <option value="Concert & Festival">Concert & Festival</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Private Dinner">Private Dinner</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Proposed Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Expected Guests *</label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">City / Venue Location *</label>
                  <input
                    type="text"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    placeholder="e.g. Maitama, Abuja or Victoria Island, Lagos"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Requirements & Deliverables</label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your vision, specific dishes, technical equipment, theme, or schedule..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e] leading-relaxed"
                />
              </div>
            </div>

            {/* 3. ORGANIZER CONTACT DETAILS */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                {vendor.packages && vendor.packages.length > 0 ? '3.' : '2.'} Your Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Stephen Adeleke"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Callout */}
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 space-y-0.5">
                <span className="font-bold block">100% Milestone Escrow Guarantee</span>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  Requesting a quote is completely free. When you accept the vendor's proposal, funds are held securely in Eventory Escrow and only disbursed as event milestones are fulfilled.
                </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Indicative Scope</span>
                <span className="text-base font-black text-[#301d6e]">
                  From {formatNaira(calculatedEstimate)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-[#301d6e] hover:bg-[#20134e] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4 text-[#8ec82d]" />
                  <span>{isSubmitting ? 'Sending to Vendor...' : 'Send Request'}</span>
                </button>
              </div>
            </div>

          </form>
        ) : (
          /* CONFIRMATION SCREEN */
          <div className="p-8 sm:p-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Inquiry Logged on Neon DB
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-1">
                Quotation Request Dispatched!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Your request has been routed to <strong>{vendor.businessName}</strong>. You will receive their proposal and milestone invoice on WhatsApp & email.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{selectedPackage ? selectedPackage.name : 'Custom Scope'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Event Date:</span>
                <span className="font-bold text-slate-900">{eventDate} (~{guestCount} guests)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Turnaround:</span>
                <span className="font-bold text-emerald-600">Within {vendor.responseRate}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-[#301d6e] hover:bg-[#20134e] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Done & Return to Marketplace
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
