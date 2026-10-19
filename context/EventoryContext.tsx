'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  EventItem, VendorItem, ActiveWorkspace, WorkspaceGuest, WorkspaceTask, 
  WorkspaceInvoice, WorkspaceQuote, WorkspaceChatMessage, VendorEnquiry, VendorBooking 
} from '../types';
import { 
  INITIAL_EVENTS, INITIAL_VENDORS, INITIAL_WORKSPACE, 
  INITIAL_VENDOR_ENQUIRIES, INITIAL_VENDOR_BOOKINGS 
} from '../data/mockData';
import { generateTicketCode } from '../lib/utils';

export interface ConfirmedTicketData {
  ticketCode: string;
  qrData: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketTierName: string;
  quantity: number;
  totalPaid: number;
  purchasedAt: string;
}

interface EventoryContextType {
  events: EventItem[];
  vendors: VendorItem[];
  workspace: ActiveWorkspace;
  vendorEnquiries: VendorEnquiry[];
  vendorBookings: VendorBooking[];
  activeTicketModal: EventItem | null;
  setActiveTicketModal: (event: EventItem | null) => void;
  lastConfirmedTicket: ConfirmedTicketData | null;
  setLastConfirmedTicket: (ticket: ConfirmedTicketData | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Actions
  purchaseTicket: (
    event: EventItem,
    tierId: string,
    quantity: number,
    attendee: { name: string; email: string; phone: string }
  ) => ConfirmedTicketData;
  checkInGuest: (ticketCode: string) => { success: boolean; message: string; guest?: WorkspaceGuest; alreadyCheckedIn?: boolean };
  updateGuestCheckInStatus: (guestId: string, checkedIn: boolean) => void;
  addWorkspaceTask: (task: Omit<WorkspaceTask, 'id' | 'status'>) => void;
  toggleWorkspaceTask: (taskId: string) => void;
  approveQuote: (quoteId: string) => void;
  payMilestone: (invoiceId: string, amount: number) => void;
  sendTeamMessage: (message: string) => void;
  requestVendorQuote: (
    vendor: VendorItem,
    data: { eventType: string; date: string; guestCount: number; requirements: string; contactName: string; phone: string; email: string }
  ) => void;
  respondToEnquiry: (enquiryId: string, quotedAmount: number) => void;
  createEvent: (newEvent: EventItem) => void;
  registerVendor: (newVendor: VendorItem) => void;
}

const EventoryContext = createContext<EventoryContextType | undefined>(undefined);

export function EventoryProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [vendors, setVendors] = useState<VendorItem[]>(INITIAL_VENDORS);
  const [workspace, setWorkspace] = useState<ActiveWorkspace>(INITIAL_WORKSPACE);
  const [vendorEnquiries, setVendorEnquiries] = useState<VendorEnquiry[]>(INITIAL_VENDOR_ENQUIRIES);
  const [vendorBookings, setVendorBookings] = useState<VendorBooking[]>(INITIAL_VENDOR_BOOKINGS);
  const [activeTicketModal, setActiveTicketModal] = useState<EventItem | null>(null);
  const [lastConfirmedTicket, setLastConfirmedTicket] = useState<ConfirmedTicketData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const purchaseTicket = (
    event: EventItem,
    tierId: string,
    quantity: number,
    attendee: { name: string; email: string; phone: string }
  ) => {
    const tier = event.ticketTiers.find((t) => t.id === tierId) || event.ticketTiers[0];
    const ticketCode = generateTicketCode('EVT');
    const subtotal = tier.price * quantity;
    const fee = tier.price === 0 ? 0 : Math.round(subtotal * 0.05 + 100);
    const grandTotal = subtotal + fee;

    // 1. Decrement tier remaining count & increment ticketsSold
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === event.id
          ? {
              ...evt,
              ticketsSold: evt.ticketsSold + quantity,
              ticketTiers: evt.ticketTiers.map((t) =>
                t.id === tierId ? { ...t, remaining: Math.max(0, t.remaining - quantity) } : t
              )
            }
          : evt
      )
    );

    // 2. Add attendee to active workspace guest list
    const newGuest: WorkspaceGuest = {
      id: `gst-${Date.now().toString().slice(-4)}`,
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      ticketType: tier.name.includes('VIP') ? 'VIP' : 'Regular',
      ticketCode,
      checkedIn: false,
      paymentStatus: tier.price === 0 ? 'complimentary' : 'paid',
      tableNumber: 'Table Assigned at Gate'
    };

    setWorkspace((prev) => ({
      ...prev,
      registeredGuests: prev.registeredGuests + quantity,
      guests: [newGuest, ...prev.guests]
    }));

    const confirmed: ConfirmedTicketData = {
      ticketCode,
      qrData: `EVENTORY:${ticketCode}:${event.id}:${attendee.name}`,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      venue: event.venue,
      city: event.city,
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      attendeePhone: attendee.phone,
      ticketTierName: tier.name,
      quantity,
      totalPaid: grandTotal,
      purchasedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setLastConfirmedTicket(confirmed);
    showToast(`✓ Ticket ${ticketCode} generated for ${attendee.name}!`);
    return confirmed;
  };

  const checkInGuest = (ticketCode: string) => {
    const normalized = ticketCode.trim().toUpperCase();
    const target = workspace.guests.find((g) => g.ticketCode.toUpperCase() === normalized);

    if (!target) {
      return { success: false, message: `Ticket "${normalized}" not found in Eventory registry.` };
    }

    if (target.checkedIn) {
      return {
        success: false,
        alreadyCheckedIn: true,
        guest: target,
        message: `Already checked in at ${target.checkInTime || 'earlier today'}.`
      };
    }

    const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updatedGuest: WorkspaceGuest = { ...target, checkedIn: true, checkInTime: timeString };

    setWorkspace((prev) => ({
      ...prev,
      guests: prev.guests.map((g) => (g.id === target.id ? updatedGuest : g))
    }));

    showToast(`✓ Admitted ${target.name} (${target.ticketType}) at Gate`);
    return { success: true, message: `Admitted ${target.name}`, guest: updatedGuest };
  };

  const updateGuestCheckInStatus = (guestId: string, checkedIn: boolean) => {
    const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setWorkspace((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === guestId ? { ...g, checkedIn, checkInTime: checkedIn ? timeString : undefined } : g
      )
    }));
  };

  const addWorkspaceTask = (task: Omit<WorkspaceTask, 'id' | 'status'>) => {
    const newTask: WorkspaceTask = {
      id: `tsk-${Date.now().toString().slice(-4)}`,
      ...task,
      status: 'pending'
    };
    setWorkspace((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      activeTasks: prev.activeTasks + 1
    }));
    showToast(`📋 Task added to ${workspace.title}`);
  };

  const toggleWorkspaceTask = (taskId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
    }));
  };

  const approveQuote = (quoteId: string) => {
    const quote = workspace.quotes.find((q) => q.id === quoteId);
    if (!quote) return;

    const newInvoice: WorkspaceInvoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      vendorName: quote.vendorName,
      serviceCategory: quote.category,
      amount: quote.quotedAmount,
      paidAmount: 0,
      status: 'pending_approval',
      dueDate: '10 Dec 2027',
      invoiceNumber: `INV-${quote.vendorName.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`
    };

    setWorkspace((prev) => ({
      ...prev,
      bookedVendors: prev.bookedVendors + 1,
      totalBudget: prev.totalBudget + quote.quotedAmount,
      totalOutstanding: prev.totalOutstanding + quote.quotedAmount,
      quotes: prev.quotes.map((q) => (q.id === quoteId ? { ...q, status: 'approved' as const } : q)),
      invoices: [newInvoice, ...prev.invoices]
    }));

    showToast(`🤝 Quote from ${quote.vendorName} approved! Contract active.`);
  };

  const payMilestone = (invoiceId: string, amount: number) => {
    setWorkspace((prev) => {
      const updatedInvoices = prev.invoices.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + amount;
          return {
            ...inv,
            paidAmount: newPaid,
            status: (newPaid >= inv.amount ? 'paid' : 'partially_paid') as WorkspaceInvoice['status']
          };
        }
        return inv;
      });

      return {
        ...prev,
        invoices: updatedInvoices,
        totalPaid: prev.totalPaid + amount,
        totalOutstanding: Math.max(0, prev.totalOutstanding - amount)
      };
    });

    showToast(`💳 ₦${amount.toLocaleString()} paid to vendor escrow!`);
  };

  const sendTeamMessage = (message: string) => {
    const newMsg: WorkspaceChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Lead Organiser',
      role: 'Host',
      message,
      timestamp: 'Just now',
      avatarColor: 'bg-[#301d6e]'
    };
    setWorkspace((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg]
    }));
  };

  const requestVendorQuote = (
    vendor: VendorItem,
    data: { eventType: string; date: string; guestCount: number; requirements: string; contactName: string; phone: string; email: string }
  ) => {
    // 1. Add quote to Workspace
    const newQuote: WorkspaceQuote = {
      id: `qt-${Date.now().toString().slice(-4)}`,
      vendorName: vendor.businessName,
      category: vendor.category,
      quotedAmount: vendor.priceFrom,
      submittedDate: 'Today',
      details: `${data.eventType} for ~${data.guestCount} guests on ${data.date}. ${data.requirements}`,
      status: 'pending'
    };
    setWorkspace((prev) => ({
      ...prev,
      quotes: [newQuote, ...prev.quotes]
    }));

    // 2. Add enquiry to Vendor portal
    const newEnquiry: VendorEnquiry = {
      id: `enq-${Date.now().toString().slice(-4)}`,
      eventTitle: `${data.contactName}'s ${data.eventType}`,
      organizerName: data.contactName,
      organizerPhone: data.phone,
      organizerEmail: data.email,
      date: data.date,
      guestCount: data.guestCount,
      budgetEstimated: vendor.priceFrom,
      status: 'pending',
      notes: data.requirements || 'Standard quote scope requested.',
      receivedTime: 'Just now'
    };
    setVendorEnquiries((prev) => [newEnquiry, ...prev]);

    showToast(`✉️ Quotation request sent to ${vendor.businessName}!`);
  };

  const respondToEnquiry = (enquiryId: string, quotedAmount: number) => {
    setVendorEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: 'quoted' as const } : e))
    );
    showToast(`✓ Quotation for ₦${quotedAmount.toLocaleString()} sent to client!`);
  };

  const createEvent = (newEvent: EventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`🎉 "${newEvent.title}" published!`);
  };

  const registerVendor = (newVendor: VendorItem) => {
    setVendors((prev) => [newVendor, ...prev]);
    showToast(`🏬 "${newVendor.businessName}" listed on Marketplace!`);
  };

  return (
    <EventoryContext.Provider
      value={{
        events,
        vendors,
        workspace,
        vendorEnquiries,
        vendorBookings,
        activeTicketModal,
        setActiveTicketModal,
        lastConfirmedTicket,
        setLastConfirmedTicket,
        toastMessage,
        showToast,
        purchaseTicket,
        checkInGuest,
        updateGuestCheckInStatus,
        addWorkspaceTask,
        toggleWorkspaceTask,
        approveQuote,
        payMilestone,
        sendTeamMessage,
        requestVendorQuote,
        respondToEnquiry,
        createEvent,
        registerVendor
      }}
    >
      {children}
    </EventoryContext.Provider>
  );
}

export function useEventory() {
  const context = useContext(EventoryContext);
  if (!context) {
    throw new Error('useEventory must be used within an EventoryProvider');
  }
  return context;
}
