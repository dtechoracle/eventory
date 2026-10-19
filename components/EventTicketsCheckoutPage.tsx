'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import GateScannerModal from './GateScannerModal';
import { useEventory } from '../context/EventoryContext';
import { formatNaira, generateTicketCode } from '../lib/utils';
import { 
  X, Calendar, MapPin, CheckCircle2, QrCode, Download, ShieldCheck, 
  Ticket, User, Mail, Phone, CreditCard, Building2, ArrowRight, 
  ArrowLeft, Info, ChevronDown, Check, Smartphone, Sparkles, UserCheck 
} from 'lucide-react';

export default function EventTicketsCheckoutPage({ id }: { id: string }) {
  const router = useRouter();
  const { events, purchaseTicket, checkInGuest } = useEventory();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const event = events.find((e) => e.id === id);
  if (!event) {
    notFound();
  }

  // Stepper: 1. tickets -> 2. attendee -> 3. payment -> 4. confirmed
  const [currentStep, setCurrentStep] = useState<'tickets' | 'attendee' | 'payment' | 'confirmed'>('tickets');

  // Quantities per tier (defaults 1 for first tier)
  const [tierQuantities, setTierQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    const tiers = event?.ticketTiers || [];
    tiers.forEach((tier, idx) => {
      initial[tier.id] = idx === 0 ? 1 : 0;
    });
    return initial;
  });

  // Purchaser Details
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');

  // "Buying for someone else" state
  const [isBuyingForSomeoneElse, setIsBuyingForSomeoneElse] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    code: string;
    tierName: string;
    attendeeName: string;
    total: number;
  } | null>(null);

  // Compute totals
  let rawSubtotal = 0;
  let totalTicketsCount = 0;
  const selectedItemsList: { name: string; quantity: number; cost: number; price: number }[] = [];

  const tiers = event?.ticketTiers || [];
  tiers.forEach((tier) => {
    const qty = tierQuantities[tier.id] || 0;
    if (qty > 0) {
      const lineCost = tier.price * qty;
      rawSubtotal += lineCost;
      totalTicketsCount += qty;
      selectedItemsList.push({
        name: tier.name,
        quantity: qty,
        cost: lineCost,
        price: tier.price
      });
    }
  });

  const isFree = rawSubtotal === 0;
  const serviceFee = isFree ? 0 : Math.round(rawSubtotal * 0.05 + 500);
  const totalAmount = rawSubtotal + serviceFee;

  const handleUpdateQuantity = (tierId: string, quantity: number) => {
    setTierQuantities((prev) => ({
      ...prev,
      [tierId]: quantity
    }));
  };

  const handleProceedToAttendee = () => {
    if (totalTicketsCount === 0) {
      alert('Please select at least 1 ticket to continue.');
      return;
    }
    setCurrentStep('attendee');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!purchaserName.trim() || !purchaserEmail.trim()) {
      alert('Please provide your name and email address.');
      return;
    }
    if (isBuyingForSomeoneElse && (!recipientName.trim() || !recipientEmail.trim())) {
      alert("Please provide the recipient attendee's name and email.");
      return;
    }
    if (isFree) {
      handleCompletePurchase();
    } else {
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompletePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const code = generateTicketCode('EVT');
      const primaryTierName = selectedItemsList[0]?.name || event.ticketTiers[0].name;
      const finalAttendeeName = isBuyingForSomeoneElse ? recipientName : purchaserName;
      const finalAttendeeEmail = isBuyingForSomeoneElse ? recipientEmail : purchaserEmail;
      const finalAttendeePhone = isBuyingForSomeoneElse ? recipientPhone : purchaserPhone;

      purchaseTicket(event, event.ticketTiers[0].id, totalTicketsCount, {
        name: finalAttendeeName,
        email: finalAttendeeEmail,
        phone: finalAttendeePhone
      });

      setConfirmedData({
        code,
        tierName: primaryTierName,
        attendeeName: finalAttendeeName,
        total: totalAmount
      });

      setIsProcessing(false);
      setCurrentStep('confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans w-full overflow-x-hidden pb-24 lg:pb-0">
      
      {/* 1. CLEAN TOPBAR (Back icon on left, "Checkout" in middle, X on right, NO event name) */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href={`/events/${event.id}`}
            className="p-1.5 -ml-1.5 text-slate-700 hover:text-[#301d6e] transition-colors"
            aria-label="Back to event"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <h1 className="text-base font-black text-slate-900 tracking-tight text-center">
            Checkout
          </h1>

          <Link
            href={`/events/${event.id}`}
            className="p-1.5 -mr-1.5 text-slate-400 hover:text-slate-800 transition-colors"
            aria-label="Exit checkout"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* 2. STEPPER (Single line, no numbers, perfectly aligned on mobile and desktop) */}
      {currentStep !== 'confirmed' && (
        <div className="border-b border-slate-100 bg-slate-50/70 py-3">
          <div className="max-w-md mx-auto px-4 flex items-center justify-center gap-3 sm:gap-6 text-xs font-semibold whitespace-nowrap">
            
            {/* Tickets */}
            <div className={`flex items-center gap-1.5 ${currentStep === 'tickets' ? 'text-[#301d6e] font-black' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentStep === 'tickets' ? 'bg-[#301d6e]' : 'bg-slate-300'}`}></span>
              <span>Tickets</span>
            </div>

            <div className="w-6 sm:w-10 h-px bg-slate-200 shrink-0"></div>

            {/* Contact */}
            <div className={`flex items-center gap-1.5 ${currentStep === 'attendee' ? 'text-[#301d6e] font-black' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentStep === 'attendee' ? 'bg-[#301d6e]' : 'bg-slate-300'}`}></span>
              <span>Contact</span>
            </div>

            <div className="w-6 sm:w-10 h-px bg-slate-200 shrink-0"></div>

            {/* Payment */}
            <div className={`flex items-center gap-1.5 ${currentStep === 'payment' ? 'text-[#301d6e] font-black' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentStep === 'payment' ? 'bg-[#301d6e]' : 'bg-slate-300'}`}></span>
              <span>Payment</span>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {currentStep === 'confirmed' ? (
          /* SUCCESS STATE: ISSUED DIGITAL TICKET PASS */
          <div className="max-w-xl mx-auto text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#8ec82d]/20 text-[#301d6e] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#76a824]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#76a824] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Payment Verified • Pass Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-2">
                You're ready for {event.title}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Your entry ticket has been issued. Digital QR pass sent to <strong>{isBuyingForSomeoneElse ? recipientEmail : purchaserEmail}</strong>.
              </p>
            </div>

            {/* Pass Preview Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Pass Code</span>
                  <strong className="text-sm font-mono text-[#301d6e] block">{confirmedData?.code}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Ticket Holder</span>
                  <span className="text-xs font-bold text-slate-900 block">{confirmedData?.attendeeName}</span>
                  {isBuyingForSomeoneElse && (
                    <span className="text-[10px] text-purple-600 block">Purchased by {purchaserName}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-500">Tier: <strong>{confirmedData?.tierName}</strong></span>
                <span className="font-black text-slate-900">{formatNaira(confirmedData?.total || 0)}</span>
              </div>

              {/* QR Code Container */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                <div className="w-32 h-32 mx-auto bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">Scan at {event.venue} gate</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#301d6e] hover:bg-[#20134e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Simulate Gate Check-in
              </button>
              <Link
                href={`/events/${event.id}`}
                className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                Return to Event Page
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: Stepper views */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: CHOOSE TICKETS */}
              {currentStep === 'tickets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900">Choose Tickets</h2>
                    <span className="text-xs text-slate-500">Select quantity</span>
                  </div>

                  <div className="space-y-4">
                    {event.ticketTiers.map((tier) => {
                      const qty = tierQuantities[tier.id] || 0;
                      const isSoldOut = tier.remaining <= 0;
                      const isSelected = qty > 0;

                      return (
                        <div
                          key={tier.id}
                          className={`p-4 sm:p-5 rounded-2xl transition-all space-y-3 ${
                            isSelected
                              ? 'border-2 border-[#301d6e] bg-[#301d6e]/5 ring-1 ring-[#301d6e] shadow-sm'
                              : isSoldOut
                              ? 'border border-slate-200 bg-slate-50 opacity-60'
                              : 'border border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                                  {tier.name}
                                </h3>
                                {isSelected && (
                                  <span className="text-[10px] font-black text-white bg-[#301d6e] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                                    <Check className="w-3 h-3 text-[#8ec82d] stroke-[3]" />
                                    {qty} selected
                                  </span>
                                )}
                              </div>
                              <div className="pt-0.5">
                                <span className={`text-sm sm:text-base font-black ${isSelected ? 'text-[#301d6e]' : 'text-slate-900'}`}>
                                  {formatNaira(tier.price)}
                                </span>
                                {tier.price > 0 && (
                                  <span className="text-xs text-slate-400 font-medium ml-2">
                                    includes ₦500 fee
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Dropdown */}
                            <div className="relative shrink-0">
                              <select
                                value={qty}
                                disabled={isSoldOut}
                                onChange={(e) => handleUpdateQuantity(tier.id, Number(e.target.value))}
                                className={`w-18 px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer appearance-none text-center ${
                                  isSelected
                                    ? 'bg-[#301d6e] text-white border-[#301d6e] shadow-xs'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                                }`}
                              >
                                {[0, 1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                                  <option key={num} value={num} className="bg-white text-slate-900">
                                    {num}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {tier.description}
                          </p>

                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                              # Access Pass
                            </span>
                            {tier.remaining < 25 && !isSoldOut && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                Only {tier.remaining} remaining
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* REMOVED INLINE BUTTON: Only one button exists on mobile, fixed to the bottom! */}
                </div>
              )}

              {/* STEP 2: ATTENDEE & CONTACT DETAILS */}
              {currentStep === 'attendee' && (
                <form onSubmit={handleProceedToPayment} className="space-y-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('tickets')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#301d6e] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to ticket selection
                  </button>

                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-slate-900">Your Contact Details</h2>
                    <p className="text-xs text-slate-500">
                      Payment receipts and order notifications will be sent to your email.
                    </p>
                  </div>

                  <div className="space-y-3.5 bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={purchaserName}
                        onChange={(e) => setPurchaserName(e.target.value)}
                        placeholder="e.g. Jeremiah Adeleke"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        value={purchaserEmail}
                        onChange={(e) => setPurchaserEmail(e.target.value)}
                        placeholder="e.g. jeremiah@example.com"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={purchaserPhone}
                        onChange={(e) => setPurchaserPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      />
                    </div>
                  </div>

                  {/* "BUYING FOR SOMEONE ELSE" TOGGLE */}
                  <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBuyingForSomeoneElse}
                        onChange={(e) => setIsBuyingForSomeoneElse(e.target.checked)}
                        className="w-4 h-4 rounded text-[#301d6e] focus:ring-[#301d6e] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-[#301d6e]" />
                        I am purchasing this ticket for someone else
                      </span>
                    </label>

                    {isBuyingForSomeoneElse && (
                      <div className="space-y-3 pt-3 border-t border-purple-200/60 animate-in fade-in duration-200">
                        <p className="text-xs text-slate-600">
                          Enter the details of the person who will be attending. Their name and pass will appear on the gate check-in scanner.
                        </p>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Attendee's Full Name *</label>
                          <input
                            type="text"
                            required={isBuyingForSomeoneElse}
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="e.g. Stephen Chioma"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Attendee's Email Address *</label>
                          <input
                            type="email"
                            required={isBuyingForSomeoneElse}
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="e.g. stephen.guest@example.com"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Attendee's Phone (Optional)</label>
                          <input
                            type="tel"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            placeholder="+234 802 000 0000"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* STEP 3: PAYMENT REVIEW */}
              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('attendee')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#301d6e] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to attendee details
                  </button>

                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-slate-900">Select Payment Method</h2>
                    <p className="text-xs text-slate-500">
                      All transactions are protected with bank-grade SSL escrow protection.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#301d6e] bg-[#301d6e]/5 ring-1 ring-[#301d6e]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#301d6e]" />
                        <div>
                          <strong className="text-xs sm:text-sm text-slate-900 block">Debit / Credit Card (Paystack)</strong>
                          <span className="text-[11px] text-slate-500">Instant confirmation via Visa, Mastercard, Verve</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">Instant</span>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'transfer'
                          ? 'border-[#301d6e] bg-[#301d6e]/5 ring-1 ring-[#301d6e]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-[#301d6e]" />
                        <div>
                          <strong className="text-xs sm:text-sm text-slate-900 block">Bank Transfer</strong>
                          <span className="text-[11px] text-slate-500">Dedicated automated virtual Nigerian bank account</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">1 - 2 mins</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: SUMMARY CARD (Desktop only actions, hidden on mobile!) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <h2 className="text-base font-black text-slate-900">Summary</h2>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                
                {/* Event Title & Metadata */}
                <div>
                  <h3 className="font-black text-base text-slate-900 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.date}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.venue}</span>
                  </p>
                </div>

                <hr className="border-slate-100" />

                {/* Items Breakdown */}
                <div className="space-y-2.5 text-xs">
                  {selectedItemsList.length > 0 ? (
                    selectedItemsList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700">
                        <span>{item.quantity} × {item.name}</span>
                        <span className="font-semibold text-slate-900">{formatNaira(item.cost)}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No tickets selected</span>
                  )}

                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      Service fees <Info className="w-3 h-3 text-slate-400" />
                    </span>
                    <span className="font-semibold text-slate-700">
                      {isFree ? '₦0' : formatNaira(serviceFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700">{formatNaira(totalAmount)}</span>
                  </div>
                </div>

                {/* Promo Code Note Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 text-center">
                  Discount codes are now added in the payment step
                </div>

                <hr className="border-slate-100" />

                {/* Total */}
                <div className="flex items-center justify-between text-base font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-[#301d6e]">{formatNaira(totalAmount)}</span>
                </div>

                {/* Desktop Step Actions (HIDDEN ON MOBILE: only the fixed bottom bar is used on mobile!) */}
                <div className="hidden lg:block pt-2">
                  {currentStep === 'tickets' && (
                    <button
                      type="button"
                      onClick={handleProceedToAttendee}
                      className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Continue
                    </button>
                  )}

                  {currentStep === 'attendee' && (
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Continue to Payment
                    </button>
                  )}

                  {currentStep === 'payment' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleCompletePurchase}
                      className="w-full py-3.5 bg-[#8ec82d] hover:bg-[#76a824] text-[#1e1144] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? 'Processing Transaction...' : `Pay ${formatNaira(totalAmount)}`}
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* MOBILE STICKY BOTTOM BAR (THE ONLY BUTTON ON MOBILE!) */}
      {currentStep !== 'confirmed' && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3.5 z-40 shadow-xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total ({totalTicketsCount} {totalTicketsCount === 1 ? 'ticket' : 'tickets'})</span>
            <strong className="text-base font-black text-[#301d6e]">{formatNaira(totalAmount)}</strong>
          </div>

          <div>
            {currentStep === 'tickets' && (
              <button
                type="button"
                onClick={handleProceedToAttendee}
                className="px-6 py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Continue
              </button>
            )}

            {currentStep === 'attendee' && (
              <button
                type="button"
                onClick={() => handleProceedToPayment()}
                className="px-6 py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Continue to Payment
              </button>
            )}

            {currentStep === 'payment' && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompletePurchase}
                className="px-6 py-3 bg-[#8ec82d] hover:bg-[#76a824] text-[#1e1144] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {isProcessing ? 'Processing...' : `Pay ${formatNaira(totalAmount)}`}
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />

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
