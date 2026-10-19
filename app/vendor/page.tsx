'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GateScannerModal from '../../components/GateScannerModal';
import { useEventory } from '../../context/EventoryContext';
import { formatNaira } from '../../lib/utils';
import { VendorEnquiry, VendorBooking } from '../../types';
import { 
  Store, Briefcase, Calendar, Receipt, Star, Clock, CheckCircle2, 
  Send, XCircle, Plus, ChevronRight, Settings, ShieldCheck, DollarSign, Users, Award 
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { vendors, vendorEnquiries, vendorBookings, respondToEnquiry, checkInGuest } = useEventory();
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'bookings' | 'packages' | 'quotes' | 'reviews'>('overview');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Active vendor profile (demonstrating ABC Events & Royal Catering)
  const currentVendor = vendors[0];

  // Send quote response modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<VendorEnquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);

  const pendingEnquiries = vendorEnquiries.filter((e) => e.status === 'pending');
  const totalRevenue = vendorBookings.reduce((sum, b) => sum + (b.depositStatus === 'paid' ? b.amount : 0), 0);

  const handleSendQuoteResponse = () => {
    if (selectedEnquiry && quoteAmount > 0) {
      respondToEnquiry(selectedEnquiry.id, quoteAmount);
      setSelectedEnquiry(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      <Navbar onOpenGateScanner={() => setIsScannerOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[720px]">
          
          {/* Vendor Left Sidebar */}
          <aside className="w-full md:w-64 bg-slate-50/80 border-r border-slate-200/80 p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              
              {/* Vendor Profile Header */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-black text-[#8ec82d] bg-[#301d6e] px-2 py-0.5 rounded w-fit">
                  Verified Vendor
                </div>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{currentVendor.businessName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{currentVendor.category} • {currentVendor.city}</p>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-[#8ec82d] text-[#8ec82d]" />
                  <span>{currentVendor.rating}</span>
                  <span className="text-slate-400 font-normal">({currentVendor.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Business Overview', icon: Briefcase },
                  { id: 'enquiries', label: 'Client Enquiries', icon: Send, badge: pendingEnquiries.length > 0 ? `${pendingEnquiries.length} New` : undefined },
                  { id: 'bookings', label: 'Confirmed Bookings', icon: Calendar, badge: String(vendorBookings.length) },
                  { id: 'packages', label: 'Packages & Rates', icon: Store },
                  { id: 'quotes', label: 'Quotes & Invoices', icon: Receipt },
                  { id: 'reviews', label: 'Client Reviews', icon: Star, badge: String(currentVendor.reviewsCount) }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#301d6e] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#8ec82d]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isActive ? 'bg-[#8ec82d] text-[#20134e]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

            </div>

            {/* Public Listing Link */}
            <div className="pt-4 border-t border-slate-200/80">
              <Link
                href={`/marketplace/${currentVendor.id}`}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#301d6e] font-bold text-xs rounded-xl transition-colors"
              >
                <span>View Public Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            
            {/* Contextual Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Vendor Operations Portal</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {activeTab === 'overview' && 'Business Performance & Booking Pipeline'}
                  {activeTab === 'enquiries' && 'Incoming Quotation Requests'}
                  {activeTab === 'bookings' && 'Confirmed Event Calendar'}
                  {activeTab === 'packages' && 'Package Offerings & Base Pricing'}
                  {activeTab === 'quotes' && 'Sent Quotations & Escrow Settlement'}
                  {activeTab === 'reviews' && 'Customer Ratings & Testimonials'}
                </h2>
              </div>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Enquiries</span>
                    <span className="text-2xl font-black text-[#301d6e]">{pendingEnquiries.length}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">awaiting response</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Confirmed Bookings</span>
                    <span className="text-2xl font-black text-[#557917]">{vendorBookings.length}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">on schedule</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Escrow Revenue</span>
                    <span className="text-2xl font-black text-emerald-600">{formatNaira(totalRevenue)}</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">contracted funds</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Response Speed</span>
                    <span className="text-2xl font-black text-slate-900">99%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">&lt; 1 hour</span>
                  </div>
                </div>

                {/* Incoming Enquiries Queue */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Recent Enquiries from Organisers</h3>
                    <button onClick={() => setActiveTab('enquiries')} className="text-xs font-bold text-[#301d6e] hover:underline">
                      View all →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {vendorEnquiries.map((enq) => (
                      <div key={enq.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">{enq.eventTitle}</span>
                            <span className="text-[10px] text-slate-400">• {enq.receivedTime}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{enq.notes}</p>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Date: <strong>{enq.date}</strong> | Guests: <strong>{enq.guestCount}</strong> | Client: <strong>{enq.organizerName}</strong>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {enq.status === 'quoted' ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                              Quote Dispatched
                            </span>
                          ) : (
                            <button
                              onClick={() => { setSelectedEnquiry(enq); setQuoteAmount(enq.budgetEstimated); }}
                              className="px-3.5 py-1.5 bg-[#8ec82d] hover:bg-[#75a723] text-[#20134e] text-xs font-bold rounded-xl"
                            >
                              Send Quote
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {vendorEnquiries.map((enq) => (
                    <div key={enq.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Request #{enq.id}</span>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">{enq.eventTitle}</h4>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          enq.status === 'quoted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {enq.status === 'quoted' ? 'Quotation Sent' : 'Pending Response'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {enq.notes}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                        <div><span className="text-slate-400 block text-[10px]">Event Date</span><strong>{enq.date}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">Guest Count</span><strong>{enq.guestCount} Guests</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">Contact</span><strong>{enq.organizerName}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">Phone</span><strong>{enq.organizerPhone}</strong></div>
                      </div>

                      {enq.status === 'pending' && (
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => { setSelectedEnquiry(enq); setQuoteAmount(enq.budgetEstimated); }}
                            className="px-4 py-2 bg-[#8ec82d] text-[#20134e] text-xs font-bold rounded-xl"
                          >
                            Prepare Formal Quotation
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                      <tr>
                        <th className="py-3 px-4">Client Name</th>
                        <th className="py-3 px-4">Event Details</th>
                        <th className="py-3 px-4">Date & Venue</th>
                        <th className="py-3 px-4">Contract Amount</th>
                        <th className="py-3 px-4">Deposit Status</th>
                        <th className="py-3 px-4">Booking Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vendorBookings.map((bkg) => (
                        <tr key={bkg.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">{bkg.clientName}</td>
                          <td className="py-3 px-4">{bkg.eventTitle}</td>
                          <td className="py-3 px-4 font-medium">{bkg.date} • {bkg.venue}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{formatNaira(bkg.amount)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700">
                              {bkg.depositStatus === 'paid' ? 'Paid to Escrow' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded font-bold bg-[#301d6e]/10 text-[#301d6e]">
                              {bkg.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: PACKAGES */}
            {activeTab === 'packages' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {currentVendor.packages?.map((pkg) => (
                    <div key={pkg.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{pkg.name}</h4>
                        <p className="text-xs text-slate-500">{pkg.description}</p>
                      </div>
                      <span className="text-base font-black text-[#301d6e]">{formatNaira(pkg.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: QUOTES */}
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">All quotations are legally binding once approved by the event host.</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <strong>Escrow Security Protocol:</strong> Eventory guarantees payment disbursement upon approved event milestone completion.
                </div>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {currentVendor.reviews?.map((r) => (
                  <div key={r.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>{r.author} ({r.eventType})</span>
                      <span className="text-amber-500">★ {r.rating}.0</span>
                    </div>
                    <p className="text-slate-600 italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}

          </main>

        </div>
      </div>

      <Footer />

      {/* Quote Send Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-slate-900">Send Formal Quotation</h4>
            <p className="text-xs text-slate-600">Responding to <strong>{selectedEnquiry.organizerName}</strong> for {selectedEnquiry.eventTitle}.</p>
            <div>
              <label className="text-xs font-bold text-slate-700">Quoted Amount (₦ NGN)</label>
              <input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border rounded-xl text-sm font-bold"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedEnquiry(null)} className="px-3 py-2 text-xs">Cancel</button>
              <button onClick={handleSendQuoteResponse} className="px-4 py-2 bg-[#301d6e] text-white text-xs font-bold rounded-xl">
                Send to Organiser
              </button>
            </div>
          </div>
        </div>
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
