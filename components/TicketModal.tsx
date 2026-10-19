'use client';

import React, { useState } from 'react';
import { 
  X, Calendar, MapPin, CheckCircle2, QrCode, Download, ShieldCheck, 
  Ticket, User, Mail, Phone, CreditCard, Building2, ArrowRight, 
  ArrowLeft, Info, ChevronDown, Check, Smartphone, Sparkles 
} from 'lucide-react';
import { EventItem } from '../types';
import { formatNaira, generateTicketCode } from '../lib/utils';

interface TicketModalProps {
  event: EventItem | null;
  onClose: () => void;
  onTicketPurchased: (ticketInfo: {
    eventTitle: string;
    attendeeName: string;
    ticketTier: string;
    ticketCode: string;
    qrData: string;
    pricePaid: number;
    phone: string;
    email: string;
  }) => void;
  onOpenScannerWithTicket?: (code: string) => void;
}

export default function TicketModal({
  event,
  onClose,
  onTicketPurchased,
  onOpenScannerWithTicket
}: TicketModalProps) {
  if (!event) return null;

  // Checkout Steps (media_1792158192658.png: Tickets -> Contact -> Payment)
  const [currentStep, setCurrentStep] = useState<'tickets' | 'contact' | 'payment' | 'confirmed'>('tickets');

  // Quantities per tier (e.g. { 'tier-1': 2, 'tier-2': 0 })
  const [tierQuantities, setTierQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    const tiers = event?.ticketTiers || [];
    tiers.forEach((tier, idx) => {
      // Default first tier to 1, others to 0
      initial[tier.id] = idx === 0 ? 1 : 0;
    });
    return initial;
  });

  // Attendee Contact state
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    code: string;
    tierName: string;
    total: number;
  } | null>(null);

  // Compute totals
  let rawSubtotal = 0;
  let totalTicketsCount = 0;
  const selectedItemsList: { name: string; quantity: number; cost: number; price: number }[] = [];

  event.ticketTiers.forEach((tier) => {
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

  // Service fees matching Tix.africa screenshot: ₦0 for free, or 5% + ₦500 for paid
  const isFree = rawSubtotal === 0;
  const serviceFee = isFree ? 0 : Math.round(rawSubtotal * 0.05 + 500);
  const totalAmount = rawSubtotal + serviceFee;

  const handleUpdateQuantity = (tierId: string, quantity: number) => {
    setTierQuantities((prev) => ({
      ...prev,
      [tierId]: quantity
    }));
  };

  const handleProceedToContact = () => {
    if (totalTicketsCount === 0) {
      alert('Please select at least 1 ticket to proceed.');
      return;
    }
    setCurrentStep('contact');
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeeEmail.trim()) {
      alert('Please enter your full name and email address.');
      return;
    }
    if (isFree) {
      handleCompletePurchase();
    } else {
      setCurrentStep('payment');
    }
  };

  const handleCompletePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const code = generateTicketCode('EVT');
      const primaryTierName = selectedItemsList[0]?.name || event.ticketTiers[0].name;

      onTicketPurchased({
        eventTitle: event.title,
        attendeeName,
        ticketTier: primaryTierName,
        ticketCode: code,
        qrData: `EVENTORY:${code}:${event.id}:${attendeeName}`,
        pricePaid: totalAmount,
        phone: attendeePhone,
        email: attendeeEmail
      });

      setConfirmedData({
        code,
        tierName: primaryTierName,
        total: totalAmount
      });

      setIsProcessing(false);
      setCurrentStep('confirmed');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Bar: "Checkout" on Left, "✕" on Right (media_1792158192658.png) */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Checkout</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar (Tickets -> Contact -> Payment) */}
        {currentStep !== 'confirmed' && (
          <div className="px-6 sm:px-8 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-center gap-6 sm:gap-12 text-xs font-semibold">
            <div className={`flex items-center gap-2 ${currentStep === 'tickets' ? 'text-[#301d6e] font-bold' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentStep === 'tickets' ? 'bg-[#301d6e]' : 'bg-slate-300'}`}></span>
              <span>Tickets</span>
            </div>

            <div className="w-8 sm:w-16 h-px bg-slate-200"></div>

            <div className={`flex items-center gap-2 ${currentStep === 'contact' ? 'text-[#301d6e] font-bold' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentStep === 'contact' ? 'bg-[#301d6e]' : 'bg-slate-300'}`}></span>
              <span>Contact</span>
            </div>

            <div className="w-8 sm:w-16 h-px bg-slate-200"></div>

            <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-[#301d6e] font-bold' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentStep === 'payment' ? 'bg-[#301d6e]' : 'bg-slate-300'}`}></span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Modal Main Content: 2 Columns Layout (media_1792158192658.png) */}
        {currentStep === 'confirmed' ? (
          /* CONFIRMED PASS STATE */
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#8ec82d]/20 text-[#301d6e] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#76a824]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#76a824] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Payment Verified & Ticket Issued
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-2">You're going to {event.title}!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your digital QR pass has been generated. Confirmation details sent to <strong>{attendeeEmail}</strong>.
              </p>
            </div>

            {/* Pass Preview Card */}
            <div className="max-w-sm mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Pass Code</span>
                  <strong className="text-sm font-mono text-[#301d6e] block">{confirmedData?.code}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Attendee</span>
                  <span className="text-xs font-bold text-slate-900 block">{attendeeName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-500">Tier: <strong>{confirmedData?.tierName}</strong></span>
                <span className="font-black text-slate-900">{formatNaira(confirmedData?.total || 0)}</span>
              </div>

              {/* QR Code Graphic */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                <div className="w-28 h-28 mx-auto bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <QrCode className="w-20 h-20 text-white" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">Scan at {event.venue} gate</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onOpenScannerWithTicket && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenScannerWithTicket(confirmedData?.code || '');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#301d6e] hover:bg-[#20134e] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Simulate Gate Check-in
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            
            {/* LEFT COLUMN: Ticket Tiers & Form Steps (media_1792158192658.png) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* STEP 1: TICKETS */}
              {currentStep === 'tickets' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span>Choose Tickets</span>
                  </div>

                  <div className="space-y-4">
                    {event.ticketTiers.map((tier) => {
                      const qty = tierQuantities[tier.id] || 0;
                      const isSoldOut = tier.remaining <= 0;

                      return (
                        <div
                          key={tier.id}
                          className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-sm sm:text-base text-slate-900">
                                {tier.name}
                              </h4>
                              <div className="pt-0.5">
                                <span className="text-sm font-black text-[#301d6e]">
                                  {formatNaira(tier.price)}
                                </span>
                                {tier.price > 0 && (
                                  <span className="text-[11px] text-slate-400 font-medium ml-1.5">
                                    includes ₦500 fee
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Selector Dropdown matching media_1792158192658.png */}
                            <div className="relative shrink-0">
                              <select
                                value={qty}
                                disabled={isSoldOut}
                                onChange={(e) => handleUpdateQuantity(tier.id, Number(e.target.value))}
                                className="w-16 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e] cursor-pointer appearance-none text-center"
                              >
                                {[0, 1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed">
                            {tier.description}
                          </p>

                          {/* Tag Pill e.g. # Group 1 */}
                          <div className="pt-1">
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                              # Access Pass
                            </span>
                            {tier.remaining < 25 && !isSoldOut && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md ml-2">
                                Only {tier.remaining} tickets left
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: CONTACT DETAILS */}
              {currentStep === 'contact' && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('tickets')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#301d6e] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to tickets
                  </button>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">Contact Information</h3>
                    <p className="text-xs text-slate-500">
                      We'll send your digital tickets and entry pass to this email.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={attendeeName}
                        onChange={(e) => setAttendeeName(e.target.value)}
                        placeholder="e.g. Stephen Adeleke"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={attendeeEmail}
                        onChange={(e) => setAttendeeEmail(e.target.value)}
                        placeholder="e.g. stephen@example.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={attendeePhone}
                        onChange={(e) => setAttendeePhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 3: PAYMENT REVIEW */}
              {currentStep === 'payment' && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('contact')}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#301d6e] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to contact
                  </button>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">Select Payment Method</h3>
                    <p className="text-xs text-slate-500">
                      Protected with bank-grade SSL escrow encryption.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
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
                          <span className="text-[11px] text-slate-500">Visa, Mastercard, Verve</span>
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
                          <span className="text-[11px] text-slate-500">Dedicated virtual account</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">1 - 2 mins</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Summary Card (media_1792158192658.png) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Summary</h3>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                
                {/* Event Title */}
                <div>
                  <h4 className="font-black text-sm text-slate-900 leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {event.date} • {event.venue}
                  </p>
                </div>

                <hr className="border-slate-100" />

                {/* Items Breakdown */}
                <div className="space-y-2 text-xs">
                  {selectedItemsList.length > 0 ? (
                    selectedItemsList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700">
                        <span>{item.quantity} × {item.name}</span>
                        <span className="font-semibold text-slate-900">{formatNaira(item.cost)}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No tickets selected yet</span>
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

                {/* Discount Code Note Box (media_1792158192658.png) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 text-center">
                  Discount codes are now added in the payment step
                </div>

                <hr className="border-slate-100" />

                {/* Total Row */}
                <div className="flex items-center justify-between text-sm sm:text-base font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-[#301d6e]">{formatNaira(totalAmount)}</span>
                </div>

                {/* Primary Continue / Pay Button */}
                <div className="pt-2">
                  {currentStep === 'tickets' && (
                    <button
                      type="button"
                      disabled={totalTicketsCount === 0}
                      onClick={handleProceedToContact}
                      className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                    >
                      Continue
                    </button>
                  )}

                  {currentStep === 'contact' && (
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                    >
                      Continue to Payment
                    </button>
                  )}

                  {currentStep === 'payment' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleCompletePurchase}
                      className="w-full py-3.5 bg-[#8ec82d] hover:bg-[#76a824] text-[#1e1144] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      {isProcessing ? 'Processing Transaction...' : `Pay ${formatNaira(totalAmount)}`}
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
