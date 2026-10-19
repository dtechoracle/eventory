export interface EventItem {
  id: string;
  title: string;
  slug: string;
  organizer: string;
  organizerVerified: boolean;
  category: 'Conference' | 'Festival' | 'Music & Concert' | 'Social & Wedding' | 'Tech & Business' | 'Workshops' | 'Arts & Culture' | 'Food & Lifestyle';
  date: string;
  time: string;
  venue: string;
  city: 'Abuja' | 'Lagos' | 'Port Harcourt' | 'Online';
  state: string;
  image: string;
  description: string;
  startingPrice: number; // 0 = Free
  currency: string;
  ticketsSold: number;
  capacity: number;
  featured?: boolean;
  editorialTag?: string;
  schedule?: {
    time: string;
    title: string;
    description?: string;
  }[];
  ticketTiers: {
    id: string;
    name: string;
    price: number;
    description: string;
    remaining: number;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  refundPolicy?: string;
}

export interface VendorPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface VendorReview {
  id: string;
  author: string;
  eventType: string;
  date: string;
  rating: number;
  comment: string;
}

export interface VendorItem {
  id: string;
  businessName: string;
  category: 'Venues' | 'Catering' | 'Decoration' | 'Photography' | 'Sound & DJ' | 'Security' | 'Transportation' | 'Ushers & Support' | 'MCs' | 'Event Planning';
  city: 'Abuja' | 'Lagos' | 'Port Harcourt';
  locationAddress: string;
  guestCapacity?: string;
  priceFrom: number;
  rating: number;
  reviewsCount: number;
  responseRate: string;
  verified: boolean;
  cacRegistered: boolean;
  cacNumber?: string;
  image: string;
  portfolio: string[];
  description: string;
  servicesIncluded: string[];
  bookedCount: number;
  packages?: VendorPackage[];
  reviews?: VendorReview[];
}

export interface WorkspaceTask {
  id: string;
  title: string;
  category: 'Venue' | 'Catering' | 'Logistics' | 'Media' | 'Guest' | 'Security';
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface WorkspaceGuest {
  id: string;
  name: string;
  email: string;
  phone: string;
  ticketType: 'VIP' | 'Regular' | 'Executive' | 'Guest RSVP';
  ticketCode: string;
  checkedIn: boolean;
  checkInTime?: string;
  paymentStatus: 'paid' | 'complimentary' | 'pending';
  tableNumber?: string;
}

export interface WorkspaceInvoice {
  id: string;
  vendorName: string;
  serviceCategory: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'partially_paid' | 'pending_approval' | 'draft';
  dueDate: string;
  invoiceNumber: string;
}

export interface WorkspaceQuote {
  id: string;
  vendorName: string;
  category: string;
  quotedAmount: number;
  submittedDate: string;
  details: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface WorkspaceChatMessage {
  id: string;
  sender: string;
  role: string;
  message: string;
  timestamp: string;
  avatarColor: string;
}

export interface WorkspaceDocument {
  id: string;
  title: string;
  category: 'Contracts' | 'Schedules' | 'Floorplans' | 'Budgets';
  fileType: string;
  size: string;
  updatedDate: string;
}

export interface ActiveWorkspace {
  id: string;
  title: string;
  eventDate: string;
  targetGuests: number;
  venueName: string;
  city: string;
  registeredGuests: number;
  bookedVendors: number;
  activeTasks: number;
  totalBudget: number;
  totalPaid: number;
  totalOutstanding: number;
  tasks: WorkspaceTask[];
  guests: WorkspaceGuest[];
  invoices: WorkspaceInvoice[];
  quotes: WorkspaceQuote[];
  chatMessages: WorkspaceChatMessage[];
  documents: WorkspaceDocument[];
}

export interface VendorEnquiry {
  id: string;
  eventTitle: string;
  organizerName: string;
  organizerPhone: string;
  organizerEmail: string;
  date: string;
  guestCount: number;
  budgetEstimated: number;
  status: 'pending' | 'quoted' | 'declined';
  notes: string;
  receivedTime: string;
}

export interface VendorBooking {
  id: string;
  clientName: string;
  eventTitle: string;
  date: string;
  venue: string;
  amount: number;
  depositStatus: 'paid' | 'pending';
  bookingStatus: 'confirmed' | 'in_progress' | 'completed';
}

export type UserRole = 'creator' | 'vendor' | 'attendee';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  organizationName?: string;
}

