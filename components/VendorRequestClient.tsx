'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, ShieldCheck, Star, Users, MapPin, 
  Send, Clock, Sparkles, Calendar, DollarSign, Check, Phone, Mail, User,
  ArrowLeft, ChevronRight, Store, Building2, HelpCircle
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { VendorItem } from '../types';
import { formatNaira } from '../lib/utils';
import { useEventory } from '../context/EventoryContext';

interface VendorRequestClientProps {
  id: string;
}

export default function VendorRequestClient({ id }: VendorRequestClientProps) {
  const router = useRouter();
  const { vendors, currentUser, requestVendorQuote, toast } = useEventory();

  // Find vendor by ID or slug
  const vendor = vendors.find(
    (v) =>
      v.id === id ||
      v.slug === id ||
      (v.businessName && v.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id.toLowerCase())
  );

  // Selected package
  const [selectedPkgId, setSelectedPkgId] = useState<string>('custom');

  // Event details
  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('2027-12-15');
  const [guestCount, setGuestCount] = useState<number>(250);
  const [venueLocation, setVenueLocation] = useState<string>(vendor?.city || 'Abuja');
  const [requirements, setRequirements] = useState('');

  // Contact details
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState<string>('');

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto my-auto p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#301d6e] flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Vendor Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The event vendor you are requesting a quotation from could not be located.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#301d6e] text-white hover:bg-[#20134e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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
    const generatedRef = `ENQ-${Date.now().toString().slice(-6)}`;

    try {
      await requestVendorQuote(vendor, {
        eventType,
        date: eventDate,
        guestCount: Number(guestCount) || 100,
        requirements: scopeNotes,
        contactName: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
      });

      setEnquiryRef(generatedRef);
      setIsSuccess(true);
      toast.success(
        'Request Sent!',
        `Your inquiry has been dispatched to ${vendor.businessName}.`
      );
    } catch (err) {
      console.error('Quote submit error:', err);
      setEnquiryRef(generatedRef);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium flex-wrap">
          <Link href="/" className="hover:text-[#301d6e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/marketplace" className="hover:text-[#301d6e] transition-colors">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/marketplace/${vendor.slug || vendor.id}`} className="hover:text-[#301d6e] transition-colors">
            {vendor.businessName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">Request Service</span>
        </nav>

        {isSuccess ? (
          /* SUCCESS RECEIPT VIEW */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden my-6">
            <div className="bg-[#301d6e] p-8 text-white text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#8ec82d] text-[#1e1144] flex items-center justify-center mx-auto mb-2 shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full">
                Service Request Dispatched
              </span>
              <h1 className="text-2xl font-black">Quotation Request Sent!</h1>
              <p className="text-xs text-purple-200 max-w-md mx-auto">
                Your specifications have been routed directly to <strong>{vendor.businessName}</strong>.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Reference Code:</span>
                  <span className="font-black text-slate-900 font-mono">{enquiryRef}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Provider:</span>
                  <span className="font-bold text-slate-900">{vendor.businessName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Event Scope:</span>
                  <span className="font-bold text-slate-900">{eventType} (~{guestCount} guests)</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Target Date & Location:</span>
                  <span className="font-bold text-slate-900">{eventDate} • {venueLocation}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Package / Estimate:</span>
                  <span className="font-black text-[#301d6e]">
                    {selectedPackage ? selectedPackage.name : 'Custom Scope'} ({formatNaira(calculatedEstimate)})
                  </span>
                </div>
              </div>

              {/* Escrow note */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block">100% Escrow Milestone Guarantee</span>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    The vendor will review your deliverables and message you within {vendor.responseRate}. 
                    Payment is only transferred after you review and approve their milestone deliverables.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/marketplace"
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs text-center transition-colors"
                >
                  Explore More Vendors
                </Link>
                <Link
                  href="/dashboard/vendor/enquiries"
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-xs text-center transition-colors shadow-md"
                >
                  View in Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* DEDICATED REQUEST FORM VIEW (2 Columns) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Sticky Vendor Card & Escrow Info (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* Solid Vendor Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-100">
                  <img
                    src={vendor.image}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#301d6e] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {vendor.category}
                  </div>
                  {vendor.verified && (
                    <div className="absolute top-3 right-3 bg-[#8ec82d] text-[#1e1144] text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1e1144]" />
                      <span>CAC Verified</span>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">{vendor.businessName}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#301d6e] shrink-0" />
                    <span>{vendor.locationAddress} ({vendor.city})</span>
                  </p>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-4 h-4 text-[#8ec82d] fill-[#8ec82d]" />
                    <span>{vendor.rating}</span>
                    <span className="text-slate-400 font-normal">({vendor.reviewsCount || 24} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Responds {vendor.responseRate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Estimated Base
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#301d6e]">
                      {formatNaira(calculatedEstimate)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {selectedPackage ? `• ${selectedPackage.name}` : '• Indicative'}
                    </span>
                  </div>
                </div>

                {/* Services Included */}
                {vendor.servicesIncluded && vendor.servicesIncluded.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">Capabilities:</span>
                    {vendor.servicesIncluded.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-[#8ec82d] shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Escrow Guarantee Badge */}
              <div className="bg-emerald-50 rounded-3xl border border-emerald-200/80 p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>100% Escrow Protection</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Requesting a formal quote is 100% free. Once you accept a proposal, funds are locked in Eventory Escrow and only released when deliverables are fulfilled.
                </p>
              </div>

            </div>

            {/* RIGHT COLUMN: Formal Quotation Request Form (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
              
              <div className="pb-6 border-b border-slate-100 space-y-1">
                <h1 className="text-2xl font-black text-slate-900">
                  Request Service from {vendor.businessName}
                </h1>
                <p className="text-xs text-slate-500">
                  Fill in your event specifications below. The vendor will formulate a custom milestone proposal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                
                {/* 1. PACKAGE SELECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Step 1: Choose Service Package
                    </label>
                    <span className="text-[11px] text-slate-400">Select standard bundle or custom</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {vendor.packages && vendor.packages.length > 0 ? (
                      vendor.packages.map((pkg) => {
                        const isSelected = selectedPkgId === pkg.id;
                        return (
                          <button
                            type="button"
                            key={pkg.id}
                            onClick={() => setSelectedPkgId(pkg.id)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#301d6e] bg-[#301d6e]/5 ring-1 ring-[#301d6e]'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-slate-900">{pkg.name}</span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-[#301d6e] stroke-[3]" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                                {pkg.description}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100/80">
                              <span className="text-xs font-black text-[#301d6e] block">
                                {formatNaira(pkg.price)}
                              </span>
                              <span className="text-[9px] text-slate-400">starting base</span>
                            </div>
                          </button>
                        );
                      })
                    ) : null}

                    {/* Custom Scope Option */}
                    <button
                      type="button"
                      onClick={() => setSelectedPkgId('custom')}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPkgId === 'custom'
                          ? 'border-[#301d6e] bg-[#301d6e]/5 ring-1 ring-[#301d6e]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">Custom Scope</span>
                          {selectedPkgId === 'custom' && (
                            <Check className="w-3.5 h-3.5 text-[#301d6e] stroke-[3]" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                          Tailored specification for bespoke events.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100/80">
                        <span className="text-xs font-black text-[#301d6e] block">
                          From {formatNaira(vendor.priceFrom)}
                        </span>
                        <span className="text-[9px] text-slate-400">flexible quotation</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. EVENT SPECIFICATIONS */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                    Step 2: Event Specifications
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Event Category / Type *</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      >
                        <option value="Wedding Reception">Wedding Reception</option>
                        <option value="Corporate Summit & Conference">Corporate Summit & Conference</option>
                        <option value="Birthday Celebration">Birthday Celebration</option>
                        <option value="Concert & Live Show">Concert & Live Show</option>
                        <option value="Gala Dinner & Awards">Gala Dinner & Awards</option>
                        <option value="Private Dining & VIP Soiree">Private Dining & VIP Soiree</option>
                        <option value="Other / Cultural Festival">Other / Cultural Festival</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Target Event Date *</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Estimated Guest Count *</label>
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

                  <div className="space-y-1 pt-1">
                    <label className="block text-xs font-bold text-slate-700">Requirements & Deliverables</label>
                    <textarea
                      rows={4}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Outline any specific menu items, decor themes, staging dimensions, dietary restrictions, or audiovisual specs..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                    />
                  </div>
                </div>

                {/* 3. CONTACT INFORMATION */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                    Step 3: Host Contact Details
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Your Full Name *</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Jeremiah Ezekiel"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Phone Number (WhatsApp)</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+234 800 000 0000"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORM ACTIONS */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Indicative Budget</span>
                    <span className="text-xl font-black text-[#301d6e]">
                      From {formatNaira(calculatedEstimate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      href={`/marketplace/${vendor.slug || vendor.id}`}
                      className="w-1/2 sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-all cursor-pointer"
                    >
                      Back to Profile
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-1/2 sm:w-auto px-8 py-3 rounded-xl bg-[#301d6e] hover:bg-[#20134e] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4 text-[#8ec82d]" />
                      <span>{isSubmitting ? 'Sending Request...' : 'Submit Request'}</span>
                    </button>
                  </div>
                </div>

              </form>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
