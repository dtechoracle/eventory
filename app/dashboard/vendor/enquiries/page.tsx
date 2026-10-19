'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../../context/EventoryContext';
import { formatNaira } from '../../../../lib/utils';
import { VendorEnquiry } from '../../../../types';
import { Send, Clock, CheckCircle2, User, Phone, Mail, DollarSign, Calendar, X } from 'lucide-react';

export default function VendorEnquiriesPage() {
  const { vendorEnquiries, respondToEnquiry, showToast } = useEventory();
  const [selectedEnquiry, setSelectedEnquiry] = useState<VendorEnquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [quoteNotes, setQuoteNotes] = useState('');

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || quoteAmount <= 0) {
      alert('Please enter a valid quotation amount.');
      return;
    }
    respondToEnquiry(selectedEnquiry.id, quoteAmount);
    showToast(`✓ Quotation of ${formatNaira(quoteAmount)} sent to ${selectedEnquiry.organizerName}!`);
    setSelectedEnquiry(null);
    setQuoteAmount(0);
    setQuoteNotes('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Client Inquiries & RFPs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming requests for quotes, send milestone proposals, and message prospective event hosts.
          </p>
        </div>

        {/* Enquiries List */}
        <div className="grid grid-cols-1 gap-4">
          {vendorEnquiries.map((enq) => {
            const isPending = enq.status === 'pending';

            return (
              <div
                key={enq.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{enq.eventTitle}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isPending
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {enq.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {enq.organizerName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {enq.date}
                      </span>
                      <span>•</span>
                      <span>~{enq.guestCount} Guests</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Budget</span>
                    <strong className="text-sm sm:text-base font-black text-slate-900">
                      {formatNaira(enq.budgetEstimated)}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">Client Requirements:</span>
                  "{enq.notes}"
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Received {enq.receivedTime}
                  </span>

                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEnquiry(enq);
                        setQuoteAmount(enq.budgetEstimated);
                      }}
                      className="px-5 py-2 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Quotation</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Quote Submitted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Quote Response Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900">Submit Quotation Proposal</h3>
                <p className="text-xs text-slate-500">{selectedEnquiry.eventTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Quoted Total Amount (₦) *</label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  required
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Proposal Scope & Terms (Optional)</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Includes 3-course buffet, on-site live stations, setup, teardown and 5 trained waitstaff..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl text-[11px] text-purple-900 leading-relaxed">
                Payments will be held safely in <strong>Eventory Milestone Escrow</strong> and released upon job sign-off.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                >
                  Confirm & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
