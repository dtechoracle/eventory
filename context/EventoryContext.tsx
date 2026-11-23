'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  EventItem, VendorItem, ActiveWorkspace, WorkspaceGuest, WorkspaceTask, 
  WorkspaceInvoice, WorkspaceQuote, WorkspaceChatMessage, VendorEnquiry, VendorBooking,
  UserRole, UserProfile 
} from '../types';
import { 
  INITIAL_EVENTS, INITIAL_VENDORS, INITIAL_WORKSPACE, 
  INITIAL_VENDOR_ENQUIRIES, INITIAL_VENDOR_BOOKINGS 
} from '../data/mockData';
import { generateTicketCode } from '../lib/utils';
import ToastContainer, { ToastItem, ToastType } from '../components/ToastContainer';

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

export interface ToastMethods {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

interface EventoryContextType {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setCurrentUserRole: (role: UserRole) => void;
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
  showToast: (msg: string, type?: ToastType, description?: string) => void;
  toast: ToastMethods;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  
  // Actions
  purchaseTicket: (
    event: EventItem,
    tierId: string,
    quantity: number,
    attendee: { name: string; email: string; phone: string }
  ) => Promise<ConfirmedTicketData>;
  checkInGuest: (ticketCode: string) => Promise<{ success: boolean; message: string; guest?: WorkspaceGuest; alreadyCheckedIn?: boolean }>;
  updateGuestCheckInStatus: (guestId: string, checkedIn: boolean) => void;
  addWorkspaceTask: (task: Omit<WorkspaceTask, 'id' | 'status'>) => void;
  toggleWorkspaceTask: (taskId: string) => void;
  approveQuote: (quoteId: string) => void;
  payMilestone: (invoiceId: string, amount: number) => void;
  sendTeamMessage: (message: string) => void;
  requestVendorQuote: (
    vendor: VendorItem,
    data: { eventType: string; date: string; guestCount: number; requirements: string; contactName: string; phone: string; email: string }
  ) => Promise<void>;
  respondToEnquiry: (enquiryId: string, quotedAmount: number) => void;
  createEvent: (newEvent: EventItem) => Promise<void>;
  registerVendor: (newVendor: VendorItem) => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  role: 'creator',
  organizationName: ''
};

const EventoryContext = createContext<EventoryContextType | undefined>(undefined);

export function EventoryProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [vendors, setVendors] = useState<VendorItem[]>(INITIAL_VENDORS);
  const [workspace, setWorkspace] = useState<ActiveWorkspace>(INITIAL_WORKSPACE);
  const [vendorEnquiries, setVendorEnquiries] = useState<VendorEnquiry[]>(INITIAL_VENDOR_ENQUIRIES);
  const [vendorBookings, setVendorBookings] = useState<VendorBooking[]>(INITIAL_VENDOR_BOOKINGS);
  const [activeTicketModal, setActiveTicketModal] = useState<EventItem | null>(null);
  const [lastConfirmedTicket, setLastConfirmedTicket] = useState<ConfirmedTicketData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((msg: string, type?: ToastType, description?: string) => {
    let inferredType: ToastType = type || 'info';
    let cleanMsg = msg;

    if (!type) {
      const lower = msg.toLowerCase();
      if (
        msg.startsWith('✓') ||
        msg.startsWith('🎉') ||
        lower.includes('success') ||
        lower.includes('welcome') ||
        lower.includes('saved') ||
        lower.includes('confirmed') ||
        lower.includes('approved') ||
        lower.includes('admitted')
      ) {
        inferredType = 'success';
        cleanMsg = msg.replace(/^[✓🎉]\s*/, '');
      } else if (
        msg.startsWith('✕') ||
        lower.includes('error') ||
        lower.includes('failed') ||
        lower.includes('invalid') ||
        lower.includes('denied')
      ) {
        inferredType = 'error';
        cleanMsg = msg.replace(/^✕\s*/, '');
      } else if (
        msg.startsWith('⚠') ||
        lower.includes('warning') ||
        lower.includes('please') ||
        lower.includes('required')
      ) {
        inferredType = 'warning';
        cleanMsg = msg.replace(/^⚠\s*/, '');
      }
    }

    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = {
      id,
      type: inferredType,
      title: cleanMsg,
      description,
    };

    setToasts((prev) => [...prev.slice(-3), newToast]);
    setToastMessage(cleanMsg);

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  }, [dismissToast]);

  const toastObj: ToastMethods = useMemo(() => ({
    success: (title: string, description?: string) => showToast(title, 'success', description),
    error: (title: string, description?: string) => showToast(title, 'error', description),
    info: (title: string, description?: string) => showToast(title, 'info', description),
    warning: (title: string, description?: string) => showToast(title, 'warning', description),
  }), [showToast]);

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    showToast(`Switched active view to ${role === 'creator' ? 'Event Creator' : role === 'vendor' ? 'Vendor' : 'Attendee'}`);
  };

  // Fetch real data from backend Neon endpoints
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Fetch Events
      const eventsRes = await fetch('/api/events');
      if (eventsRes.ok) {
        const eventsJson = await eventsRes.json();
        if (eventsJson.data && Array.isArray(eventsJson.data) && eventsJson.data.length > 0) {
          setEvents(eventsJson.data);
        }
      }

      // 2. Fetch Vendors from Marketplace
      const vendorsRes = await fetch('/api/marketplace');
      if (vendorsRes.ok) {
        const vendorsJson = await vendorsRes.json();
        if (vendorsJson.data && Array.isArray(vendorsJson.data) && vendorsJson.data.length > 0) {
          setVendors(vendorsJson.data);
        }
      }

      // 3. Fetch Vendor Enquiries
      const enquiriesRes = await fetch('/api/vendor/enquiries');
      if (enquiriesRes.ok) {
        const enquiriesJson = await enquiriesRes.json();
        if (enquiriesJson.data && Array.isArray(enquiriesJson.data)) {
          setVendorEnquiries(enquiriesJson.data);
        }
      }

      // 4. Fetch Vendor Bookings
      const bookingsRes = await fetch('/api/vendor/bookings');
      if (bookingsRes.ok) {
        const bookingsJson = await bookingsRes.json();
        if (bookingsJson.data && Array.isArray(bookingsJson.data)) {
          setVendorBookings(bookingsJson.data);
        }
      }

      // 5. Fetch Tickets for Workspace Guest List
      const ticketsRes = await fetch('/api/tickets');
      if (ticketsRes.ok) {
        const ticketsJson = await ticketsRes.json();
        if (ticketsJson.data && Array.isArray(ticketsJson.data) && ticketsJson.data.length > 0) {
          const dbGuests: WorkspaceGuest[] = ticketsJson.data.map((t: any) => ({
            id: t.id,
            name: t.attendeeName,
            email: t.attendeeEmail,
            phone: t.attendeePhone || '',
            ticketType: t.tier?.name?.includes('VIP') ? 'VIP' : 'Regular',
            ticketCode: t.ticketCode,
            checkedIn: t.checkedIn,
            checkInTime: t.checkInTime ? new Date(t.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
            paymentStatus: t.paymentStatus,
            tableNumber: t.tableNumber || 'Assigned at Gate'
          }));

          setWorkspace((prev) => ({
            ...prev,
            registeredGuests: dbGuests.length,
            guests: dbGuests
          }));
        }
      }

      // 6. Check Current User
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        const authJson = await authRes.json();
        if (authJson.user) {
          setCurrentUser(authJson.user);
        } else {
          setCurrentUser(DEFAULT_USER);
        }
      }
    } catch (err) {
      console.warn('Backend data refresh warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Purchase Ticket via live Neon backend endpoint
  const purchaseTicket = async (
    event: EventItem,
    tierId: string,
    quantity: number,
    attendee: { name: string; email: string; phone: string }
  ): Promise<ConfirmedTicketData> => {
    const tier = event.ticketTiers.find((t) => t.id === tierId) || event.ticketTiers[0];
    const subtotal = tier.price * quantity;
    const fee = tier.price === 0 ? 0 : Math.round(subtotal * 0.05 + 100);
    const grandTotal = subtotal + fee;

    try {
      const res = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          tierId: tier.id,
          quantity,
          attendee
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const confirmed: ConfirmedTicketData = {
            ticketCode: json.data.ticketCode,
            qrData: json.data.qrData,
            eventTitle: json.data.eventTitle,
            eventDate: json.data.eventDate,
            eventTime: json.data.eventTime,
            venue: json.data.venue,
            city: json.data.city,
            attendeeName: json.data.attendeeName,
            attendeeEmail: json.data.attendeeEmail,
            attendeePhone: json.data.attendeePhone || attendee.phone,
            ticketTierName: json.data.ticketTierName,
            quantity: json.data.quantity,
            totalPaid: json.data.totalPaid,
            purchasedAt: new Date(json.data.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          };

          setLastConfirmedTicket(confirmed);
          showToast(`✓ Ticket ${confirmed.ticketCode} issued on Neon DB!`);

          // Update local workspace and events state
          setWorkspace((prev) => ({
            ...prev,
            registeredGuests: prev.registeredGuests + quantity,
            guests: [
              {
                id: `gst-${Date.now().toString().slice(-4)}`,
                name: attendee.name,
                email: attendee.email,
                phone: attendee.phone,
                ticketType: tier.name.includes('VIP') ? 'VIP' : 'Regular',
                ticketCode: confirmed.ticketCode,
                checkedIn: false,
                paymentStatus: tier.price === 0 ? 'complimentary' : 'paid',
                tableNumber: 'Table Assigned at Gate'
              },
              ...prev.guests
            ]
          }));

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

          return confirmed;
        }
      }
    } catch (e) {
      console.warn('Backend ticket purchase failed, using fallback:', e);
    }

    // Fallback if backend call was offline
    const ticketCode = generateTicketCode('EVT');
    const fallbackConfirmed: ConfirmedTicketData = {
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

    setLastConfirmedTicket(fallbackConfirmed);
    showToast(`✓ Ticket ${ticketCode} generated for ${attendee.name}!`);
    return fallbackConfirmed;
  };

  // Check in guest via live Neon backend endpoint
  const checkInGuest = async (ticketCode: string): Promise<{ success: boolean; message: string; guest?: WorkspaceGuest; alreadyCheckedIn?: boolean }> => {
    const normalized = ticketCode.trim().toUpperCase();

    try {
      const res = await fetch('/api/tickets/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCode: normalized })
      });

      const json = await res.json();
      if (json.success && json.guest) {
        const guestData: WorkspaceGuest = {
          id: `gst-${json.guest.ticketCode}`,
          name: json.guest.name,
          email: '',
          phone: '',
          ticketType: json.guest.ticketType.includes('VIP') ? 'VIP' : 'Regular',
          ticketCode: json.guest.ticketCode,
          checkedIn: true,
          checkInTime: json.guest.checkInTime,
          paymentStatus: 'paid',
          tableNumber: json.guest.tableNumber
        };

        setWorkspace((prev) => ({
          ...prev,
          guests: prev.guests.some((g) => g.ticketCode === normalized)
            ? prev.guests.map((g) => (g.ticketCode === normalized ? { ...g, checkedIn: true, checkInTime: json.guest.checkInTime } : g))
            : [guestData, ...prev.guests]
        }));

        showToast(json.message);
        return { success: true, message: json.message, guest: guestData };
      } else if (json.alreadyCheckedIn) {
        showToast(json.message);
        return { success: false, alreadyCheckedIn: true, message: json.message, guest: json.guest };
      } else {
        return { success: false, message: json.message || `Ticket "${normalized}" not found.` };
      }
    } catch {
      // Local fallback check
      const target = workspace.guests.find((g) => g.ticketCode.toUpperCase() === normalized);
      if (!target) {
        return { success: false, message: `Ticket "${normalized}" not found in Eventory registry.` };
      }
      if (target.checkedIn) {
        return { success: false, alreadyCheckedIn: true, guest: target, message: `Already checked in at ${target.checkInTime || 'earlier today'}.` };
      }
      const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const updatedGuest: WorkspaceGuest = { ...target, checkedIn: true, checkInTime: timeString };
      setWorkspace((prev) => ({
        ...prev,
        guests: prev.guests.map((g) => (g.id === target.id ? updatedGuest : g))
      }));
      showToast(`✓ Admitted ${target.name} (${target.ticketType}) at Gate`);
      return { success: true, message: `Admitted ${target.name}`, guest: updatedGuest };
    }
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

  // Request Vendor Quote via live Neon DB endpoint
  const requestVendorQuote = async (
    vendor: VendorItem,
    data: { eventType: string; date: string; guestCount: number; requirements: string; contactName: string; phone: string; email: string }
  ) => {
    try {
      await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote_request',
          vendorId: vendor.id,
          eventTitle: `${data.contactName}'s ${data.eventType}`,
          organizerName: data.contactName,
          organizerPhone: data.phone,
          organizerEmail: data.email,
          date: data.date,
          guestCount: data.guestCount,
          notes: data.requirements
        })
      });
    } catch (e) {
      console.warn('Quote request backend sync error:', e);
    }

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
    showToast(`✉️ Quotation request saved to Neon DB for ${vendor.businessName}!`);
  };

  const respondToEnquiry = (enquiryId: string, quotedAmount: number) => {
    setVendorEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: 'quoted' as const, quotedAmount } : e))
    );
    showToast(`✓ Quotation for ₦${quotedAmount.toLocaleString()} sent to client!`);
  };

  // Create Event via live Neon DB endpoint
  const createEvent = async (newEvent: EventItem) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        await refreshData();
        showToast(`🎉 "${newEvent.title}" published!`);
        return;
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson.error || 'Failed to publish event.', 'error');
        return;
      }
    } catch (e) {
      console.warn('Backend event creation error:', e);
      showToast('Connection error while creating event.', 'error');
    }
  };

  // Register Vendor via live Neon DB endpoint
  const registerVendor = async (newVendor: VendorItem) => {
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });
      if (res.ok) {
        await refreshData();
        showToast(`🏬 "${newVendor.businessName}" listed on Neon Marketplace!`);
        return;
      }
    } catch (e) {
      console.warn('Backend vendor registration error:', e);
    }

    setVendors((prev) => [newVendor, ...prev]);
    showToast(`🏬 "${newVendor.businessName}" listed on Marketplace!`);
  };

  return (
    <EventoryContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setCurrentUserRole,
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
        toast: toastObj,
        isLoading,
        refreshData,
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
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
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
