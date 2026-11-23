'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../context/EventoryContext';
import { formatNaira } from '../../../lib/utils';
import { 
  Ticket, Users, Search, Download, CheckCircle2, Clock, 
  Filter, QrCode, Mail, Phone, ExternalLink, ArrowRight, 
  Copy, RefreshCw, AlertCircle, Calendar
} from 'lucide-react';

interface TicketAttendeeRecord {
  id: string;
  ticketCode: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string | null;
  quantity: number;
  totalPaid: number;
  paymentStatus: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
    city: string;
  };
  tier: {
    id: string;
    name: string;
    price: number;
  };
}

function TicketsContent() {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('eventId') || 'all';

  const { events, checkInGuest, toast } = useEventory();
  const [tickets, setTickets] = useState<TicketAttendeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked-in' | 'awaiting'>('all');
  const [checkingInCode, setCheckingInCode] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const url = selectedEventId !== 'all' 
        ? `/api/tickets?eventId=${selectedEventId}` 
        : '/api/tickets';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setTickets(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedEventId]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Event filter
      if (selectedEventId !== 'all' && t.event.id !== selectedEventId) {
        return false;
      }
      // Status filter
      if (statusFilter === 'checked-in' && !t.checkedIn) return false;
      if (statusFilter === 'awaiting' && t.checkedIn) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          t.attendeeName.toLowerCase().includes(q) ||
          t.attendeeEmail.toLowerCase().includes(q) ||
          (t.attendeePhone && t.attendeePhone.toLowerCase().includes(q)) ||
          t.ticketCode.toLowerCase().includes(q) ||
          t.event.title.toLowerCase().includes(q) ||
          t.tier.name.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [tickets, selectedEventId, statusFilter, searchQuery]);

  // Aggregate stats
  const totalTicketsSold = useMemo(
    () => filteredTickets.reduce((acc, t) => acc + (t.quantity || 1), 0),
    [filteredTickets]
  );

  const totalGrossRevenue = useMemo(
    () => filteredTickets.reduce((acc, t) => acc + (t.totalPaid || 0), 0),
    [filteredTickets]
  );

  const totalCheckedIn = useMemo(
    () => filteredTickets.filter((t) => t.checkedIn).length,
    [filteredTickets]
  );

  const totalAwaiting = filteredTickets.length - totalCheckedIn;

  // Manual fast check-in
  const handleQuickCheckIn = async (ticketCode: string) => {
    try {
      setCheckingInCode(ticketCode);
      const res = await checkInGuest(ticketCode);
      if (res.success) {
        toast.success('Admitted!', res.message);
        // Optimistically update
        setTickets((prev) =>
          prev.map((t) =>
            t.ticketCode === ticketCode
              ? { ...t, checkedIn: true, checkedInAt: new Date().toLocaleTimeString() }
              : t
          )
        );
      } else {
        toast.error('Check-in Issue', res.message);
      }
    } finally {
      setCheckingInCode(null);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    toast.success('Copied', `Ticket pass ${code} copied!`);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredTickets.length === 0) {
      toast.warning('No Records', 'There are no attendee records to export.');
      return;
    }

    const headers = [
      'Ticket Code',
      'Attendee Name',
      'Email',
      'Phone',
      'Event Title',
      'Ticket Tier',
      'Quantity',
      'Total Paid (NGN)',
      'Payment Status',
      'Gate Check-in',
      'Purchase Date'
    ];

    const rows = filteredTickets.map((t) => [
      `"${t.ticketCode}"`,
      `"${t.attendeeName.replace(/"/g, '""')}"`,
      `"${t.attendeeEmail}"`,
      `"${t.attendeePhone || ''}"`,
      `"${t.event.title.replace(/"/g, '""')}"`,
      `"${t.tier.name}"`,
      t.quantity || 1,
      t.totalPaid || 0,
      t.paymentStatus,
      t.checkedIn ? 'Admitted' : 'Awaiting',
      new Date(t.createdAt).toLocaleDateString()
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventory-attendees-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export Ready', 'Attendee roster downloaded as CSV.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ticket Buyers & Attendees
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time database of ticket purchasers, contact details, payment receipts, and door admissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchTickets}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#301d6e]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/dashboard/box-office"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#8ec82d]" />
            <span>Launch Gate Scanner</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Tickets Sold</span>
            <Ticket className="w-4 h-4 text-[#301d6e]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTicketsSold}</div>
          <span className="text-[11px] text-slate-400">Total verified passes issued</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Ticket Revenue</span>
            <span className="text-xs font-bold text-[#8ec82d] bg-[#301d6e] px-2 py-0.5 rounded-full">NGN</span>
          </div>
          <div className="text-2xl font-black text-[#301d6e]">
            {formatNaira(totalGrossRevenue)}
          </div>
          <span className="text-[11px] text-slate-400">Gross ticket proceeds</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Admitted at Gate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {totalCheckedIn}
            <span className="text-xs text-slate-400 font-normal ml-1">
              ({totalTicketsSold > 0 ? Math.round((totalCheckedIn / totalTicketsSold) * 100) : 0}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{
                width: `${totalTicketsSold > 0 ? (totalCheckedIn / totalTicketsSold) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Awaiting Arrival</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{totalAwaiting}</div>
          <span className="text-[11px] text-slate-400">Confirmed ticketholders</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by attendee name, email, phone, or ticket code..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Event Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#301d6e] cursor-pointer"
            >
              <option value="all">All Events ({events.length})</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              All ({tickets.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('checked-in')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'checked-in' ? 'bg-white text-emerald-700 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Admitted
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('awaiting')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'awaiting' ? 'bg-white text-amber-700 shadow-2xs font-black' : 'hover:text-slate-900'
              }`}
            >
              Awaiting
            </button>
          </div>
        </div>

      </div>

      {/* Main Attendees Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#301d6e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-semibold">Loading ticket records from Neon Postgres...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Attendee Details</th>
                  <th className="py-3 px-5">Event</th>
                  <th className="py-3 px-5">Ticket Tier</th>
                  <th className="py-3 px-5">Ticket Pass Code</th>
                  <th className="py-3 px-5">Total Paid</th>
                  <th className="py-3 px-5">Gate Check-in</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Attendee Info */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 font-bold block text-sm">
                          {t.attendeeName}
                        </strong>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{t.attendeeEmail}</span>
                        </div>
                        {t.attendeePhone && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{t.attendeePhone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Event Info */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <Link
                          href={`/events/${t.event.id}`}
                          className="font-bold text-slate-900 hover:text-[#301d6e] transition-colors block line-clamp-1 max-w-[200px]"
                        >
                          {t.event.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {t.event.date} • {t.event.city}
                        </span>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-4 px-5">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#301d6e]/5 text-[#301d6e] border border-[#301d6e]/15">
                        {t.tier.name} {t.quantity > 1 ? `(x${t.quantity})` : ''}
                      </span>
                    </td>

                    {/* Code */}
                    <td className="py-4 px-5">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(t.ticketCode)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors text-[11px] cursor-pointer"
                        title="Click to copy ticket code"
                      >
                        <span>{t.ticketCode}</span>
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5">
                      <strong className="text-slate-900 font-black">
                        {t.totalPaid === 0 ? 'FREE' : formatNaira(t.totalPaid)}
                      </strong>
                      <span className="text-[10px] text-emerald-600 font-bold block uppercase tracking-wider">
                        {t.paymentStatus}
                      </span>
                    </td>

                    {/* Gate Check-in Status */}
                    <td className="py-4 px-5">
                      {t.checkedIn ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Admitted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Awaiting</span>
                        </span>
                      )}
                    </td>

                    {/* Quick Door Check-in Action */}
                    <td className="py-4 px-5 text-right">
                      {!t.checkedIn ? (
                        <button
                          type="button"
                          disabled={checkingInCode === t.ticketCode}
                          onClick={() => handleQuickCheckIn(t.ticketCode)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{checkingInCode === t.ticketCode ? 'Verifying...' : 'Admit Guest'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Admitted {t.checkedInAt || ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#301d6e] flex items-center justify-center mx-auto">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">No ticket purchasers found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {searchQuery
                  ? 'No attendees match your search filters. Try clearing terms.'
                  : 'Tickets bought through the guest checkout or box office will appear here immediately.'}
              </p>
            </div>
            {selectedEventId !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedEventId('all')}
                className="text-xs font-bold text-[#301d6e] hover:underline"
              >
                View tickets across all events
              </button>
            )}
          </div>
        )}

      </div>

    </div>
  );
}

export default function DashboardTicketsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="p-12 text-center text-xs text-slate-400">Loading attendees studio...</div>
      }>
        <TicketsContent />
      </Suspense>
    </DashboardLayout>
  );
}
