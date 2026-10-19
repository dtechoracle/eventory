'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import GateScannerModal from './GateScannerModal';
import { useEventory } from '../context/EventoryContext';
import { formatNaira } from '../lib/utils';
import { 
  Store, MapPin, Star, Clock, ShieldCheck, Check, Send, 
  ChevronRight, Calendar, Users, Phone, Mail, Award, Sparkles, Building2, CheckCircle2 
} from 'lucide-react';

export default function VendorProfileClient({ id }: { id: string }) {
  const { vendors, requestVendorQuote, checkInGuest } = useEventory();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const vendor = vendors.find((v) => v.id === id);
  if (!vendor) {
    notFound();
  }

  // Quote form state
  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('2027-12-15');
  const [guestCount, setGuestCount] = useState(450);
  const [requirements, setRequirements] = useState('');
  const [contactName, setContactName] = useState('Stephen Adeleke');
  const [contactPhone, setContactPhone] = useState('+234 803 234 5678');
  const [contactEmail, setContactEmail] = useState('stephen.a@adeleke.ng');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(vendor.packages?.[0]?.id || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = vendor.packages?.find((p) => p.id === selectedPackageId);
    const notes = `${pkg ? `Selected Package: ${pkg.name}. ` : ''}${requirements || 'Standard event scope requested.'}`;

    requestVendorQuote(vendor, {
      eventType,
      date: eventDate,
      guestCount,
      requirements: notes,
      contactName,
      phone: contactPhone,
      email: contactEmail
    });

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar onOpenGateScanner={() => setIsScannerOpen(true)} />

      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-100 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-500">
          <Link href="/" className="hover:text-[#301d6e]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/marketplace" className="hover:text-[#301d6e]">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate">{vendor.businessName}</span>
        </div>
      </div>

      {/* Vendor Profile Header (Brand #301d6e, NO grey) */}
      <div className="bg-[#301d6e] text-white py-12 sm:py-14 relative overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.businessName}
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b0e42]/95 via-[#301d6e]/90 to-[#301d6e]/70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-[#301d6e] text-white border border-white/20">
                  {vendor.category}
                </span>
                {vendor.verified && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#8ec82d] text-[#20134e] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    CAC Verified: {vendor.cacNumber || 'RC-1492038'}
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8ec82d]" />
                  <span>{vendor.city}, Nigeria</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {vendor.businessName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Star className="w-4 h-4 fill-[#8ec82d] text-[#8ec82d]" />
                  <span>{vendor.rating}</span>
                  <span className="text-slate-400 font-normal">({vendor.reviewsCount} verified reviews)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8ec82d]" />
                  <span>Responds in {vendor.responseRate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#8ec82d]" />
                  <span>{vendor.bookedCount} events delivered</span>
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-left md:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 block">Indicative Starting Rate</span>
              <span className="text-2xl font-black text-[#8ec82d]">
                From {formatNaira(vendor.priceFrom)}
              </span>
              <span className="text-[11px] text-slate-300 block mt-0.5">Custom scope & milestone payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Vendor Showcase (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Portfolio Gallery */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-900">Portfolio & Previous Event Work</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 h-72 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={vendor.image}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {vendor.portfolio.map((img, idx) => (
                  <div key={idx} className="h-44 rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={img}
                      alt={`Portfolio ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-900">About {vendor.businessName}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {vendor.description}
              </p>

              {/* Standard Inclusions */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 mt-4">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Standard Services Included:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {vendor.servicesIncluded.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-[#8ec82d] shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Packages */}
            {vendor.packages && vendor.packages.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-slate-900">Available Packages & Pricing</h2>
                <div className="space-y-3">
                  {vendor.packages.map((pkg) => {
                    const isSelected = pkg.id === selectedPackageId;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-[#301d6e] bg-[#301d6e]/5 ring-1 ring-[#301d6e]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-base text-slate-900">{pkg.name}</h4>
                          <p className="text-xs text-slate-500">{pkg.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {pkg.features.map((feat, fidx) => (
                              <span key={fidx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                                • {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-lg font-black text-[#301d6e]">
                            {formatNaira(pkg.price)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">estimated base</span>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1.5 ${
                            isSelected ? 'bg-[#301d6e] text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isSelected ? 'Selected in Quote' : 'Click to Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer Reviews */}
            {vendor.reviews && vendor.reviews.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900">Client Reviews</h2>
                  <span className="text-xs font-bold text-slate-500">{vendor.reviews.length} Verified Reviews</span>
                </div>

                <div className="space-y-3">
                  {vendor.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{rev.author}</span>
                          <span className="text-[10px] text-slate-400">{rev.eventType} • {rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#8ec82d] text-[#8ec82d]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Request a Quote Form (5 cols, Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-lg shadow-[#301d6e]/5 overflow-hidden">
              
              <div className="bg-[#301d6e] p-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8ec82d]">
                    BINDING QUOTATION REQUEST
                  </span>
                </div>
                <h3 className="font-black text-xl text-white">
                  Request a Formal Quote
                </h3>
                <p className="text-xs text-purple-200 mt-1">
                  Dispatched directly to {vendor.businessName} and synced to your Eventory Workspace.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmitQuote} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Category *</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Corporate Conference">Corporate Conference</option>
                      <option value="Diplomatic Gala Dinner">Diplomatic Gala Dinner</option>
                      <option value="Music Concert & Festival">Music Concert & Festival</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Event Date *</label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Guest Scope *</label>
                      <input
                        type="number"
                        min="10"
                        max="5000"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specific Scope & Notes</label>
                    <textarea
                      rows={3}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="e.g. Multi-course banquet for 450 guests, including live small chops grill station and table cutlery at Sapphire Marquee."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                    ></textarea>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Your Contact Information</span>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Organiser Name"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="WhatsApp Phone"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl text-[11px] text-[#301d6e] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8ec82d] shrink-0" />
                    <span>Protected by Eventory Escrow: Funds held securely until milestone delivery.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-[#301d6e]/20 transition-all flex items-center justify-center gap-2 border-b-2 border-[#8ec82d]"
                  >
                    <Send className="w-4 h-4 text-[#8ec82d]" />
                    <span>Send Quotation Request</span>
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#8ec82d]/20 text-[#557917] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#75a723]" />
                  </div>

                  <h4 className="text-lg font-black text-slate-900">
                    Quote Request Sent!
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {vendor.businessName} has received your event requirements and will respond within {vendor.responseRate}.
                  </p>

                  <div className="p-4 bg-slate-50 rounded-xl text-left text-xs space-y-1.5 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service:</span>
                      <strong className="text-slate-800">{vendor.category}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scope:</span>
                      <strong className="text-slate-800">{guestCount} Guests</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Workspace Status:</span>
                      <strong className="text-emerald-700">Synchronized in Quotations</strong>
                    </div>
                  </div>

                  <Link
                    href="/organiser"
                    className="block w-full py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl"
                  >
                    View in Organiser Workspace
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* Gate Scanner Simulator */}
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
