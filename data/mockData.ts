import { EventItem, VendorItem, ActiveWorkspace, VendorEnquiry, VendorBooking } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-101',
    title: 'Abuja Tech & Innovation Summit 2027',
    slug: 'abuja-tech-summit-2027',
    organizer: 'Nexus Ventures Africa',
    organizerVerified: true,
    category: 'Tech & Business',
    date: 'Saturday, Nov 14, 2027',
    time: '09:00 AM WAT',
    venue: 'International Conference Centre (ICC), Central Business District',
    city: 'Abuja',
    state: 'FCT',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'The premier convergence of enterprise leaders, venture capitalists, AI builders, and African innovators. Featuring keynote speakers from Lagos, Nairobi, Kigali, and London discussing digital infrastructure and cross-border commerce.',
    startingPrice: 15000,
    currency: 'NGN',
    ticketsSold: 840,
    capacity: 1200,
    featured: true,
    editorialTag: 'FLAGSHIP TECHNOLOGY CONVERGENCE',
    schedule: [
      { time: '08:30 AM', title: 'Accreditation & Morning Networking', description: 'Collect badges and enjoy light breakfast at the Exhibition Foyer.' },
      { time: '09:30 AM', title: 'Opening Keynote: Scaling Africa’s Compute Frontier', description: 'Presented by Dr. Amina Bello, Managing Partner at Pan-African AI Fund.' },
      { time: '11:15 AM', title: 'Panel: Cross-Border Payments & FX Liquidity', description: 'Fintech founders from Flutterwave, Paystack, and Central Bank regulators.' },
      { time: '01:00 PM', title: 'Executive Networking Luncheon & Deal Rooms', description: 'Exclusive access for VIP and Investor ticket holders.' },
      { time: '03:30 PM', title: 'Founders Pitch Stage & Closing Fireside', description: 'Top 10 seed startups pitch to international VC syndicates.' }
    ],
    ticketTiers: [
      { id: 'tier-1', name: 'General Admission', price: 15000, description: 'Access to main auditorium, exhibitions, and tea break networking.', remaining: 240 },
      { id: 'tier-2', name: 'Executive VIP Pass', price: 65000, description: 'VIP front-row seating, private speakers lounge, gala luncheon & summit toolkit.', remaining: 65 },
      { id: 'tier-3', name: 'Investor & Founder Pass', price: 150000, description: 'Exclusive deal-room entry, bilateral 1:1 matchmaking, private cocktail reception.', remaining: 15 }
    ],
    faqs: [
      { question: 'Is parking available at the venue?', answer: 'Yes, over 400 secured parking bays are available at the International Conference Centre with dedicated security escorts.' },
      { question: 'Can I transfer my ticket to a colleague?', answer: 'Yes, tickets can be reassigned directly through your Eventory confirmation email up to 48 hours prior to the event.' }
    ],
    refundPolicy: 'Refunds are available up to 7 days before the summit opening. A 5% administrative payment processing fee applies.'
  },
  {
    id: 'evt-102',
    title: 'Capital Flavours: Abuja Food & Culture Expo',
    slug: 'capital-flavours-expo',
    organizer: 'Abuja Hospitality Guild',
    organizerVerified: true,
    category: 'Festival',
    date: 'Sunday, Dec 05, 2027',
    time: '12:00 PM WAT',
    venue: 'Millennium Park Gardens, Maitama',
    city: 'Abuja',
    state: 'FCT',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    description: 'A 1-day celebration of northern & continental gastronomy, artisanal food stalls, live acoustic music, grills, and family-friendly outdoor cultural experiences.',
    startingPrice: 3500,
    currency: 'NGN',
    ticketsSold: 1420,
    capacity: 2500,
    featured: false,
    editorialTag: 'CULINARY & OUTDOOR LIFESTYLE',
    schedule: [
      { time: '12:00 PM', title: 'Gates Open & Artisanal Market Starts', description: 'Live grill smoke-off and welcome drink popups.' },
      { time: '02:30 PM', title: 'Master Chef Showcase: Contemporary Suya & Grills', description: 'Live cooking demonstration by Chef Tunde.' },
      { time: '05:00 PM', title: 'Acoustic Sunset Concert & Family Picnic', description: 'Live performances by Abuja Indie collectives.' }
    ],
    ticketTiers: [
      { id: 'tier-cf1', name: 'Standard Day Pass', price: 3500, description: 'Entrance to gardens, welcome mocktail, and concert viewing.', remaining: 820 },
      { id: 'tier-cf2', name: 'Foodie Tasting Passport', price: 12000, description: 'Includes 5 tasting vouchers from premium chef popups + branded goodie tote.', remaining: 190 }
    ],
    faqs: [
      { question: 'Are children allowed?', answer: 'Yes, children under 10 enter for free when accompanied by an adult ticket holder.' }
    ],
    refundPolicy: 'Tickets are non-refundable but transferable to other attendees.'
  },
  {
    id: 'evt-103',
    title: 'Eko Sounds Afrobeats Live Experience',
    slug: 'eko-sounds-afrobeats',
    organizer: 'Vanguard Live Lagos',
    organizerVerified: true,
    category: 'Music & Concert',
    date: 'Friday, Dec 18, 2027',
    time: '07:00 PM WAT',
    venue: 'Eko Convention Centre, Victoria Island',
    city: 'Lagos',
    state: 'Lagos',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'Electrifying end-of-year concert featuring Nigeria’s top charting global Afrobeats artists with stadium-grade visual production and unmissable energy.',
    startingPrice: 20000,
    currency: 'NGN',
    ticketsSold: 3100,
    capacity: 4500,
    featured: true,
    editorialTag: 'PREMIER YEAR-END ARENA CONCERT',
    schedule: [
      { time: '07:00 PM', title: 'Red Carpet & VIP Entrance', description: 'Photocall and signature cocktail reception.' },
      { time: '08:30 PM', title: 'Opening Acts & DJ Sets', description: 'Electrifying warmups by top Lagos resident DJs.' },
      { time: '10:00 PM', title: 'Mainstage Headline Performances', description: 'Full live band 3-hour non-stop Afrobeats concert.' }
    ],
    ticketTiers: [
      { id: 'tier-es1', name: 'Regular Floor', price: 20000, description: 'Standing area access with high-energy crowd view.', remaining: 950 },
      { id: 'tier-es2', name: 'VIP Elevated Deck', price: 80000, description: 'Elevated seating, dedicated bar service, fast-track entrance.', remaining: 180 },
      { id: 'tier-es3', name: 'Table of 8 (Platinum)', price: 1200000, description: 'Reserved premium lounge table, 3 premium bottles, platter & dedicated host.', remaining: 8 }
    ],
    faqs: [
      { question: 'What is the age restriction?', answer: 'Strictly 18 and older. Government-issued ID required at entry gate.' }
    ],
    refundPolicy: 'All sales are final unless the concert is rescheduled or cancelled.'
  },
  {
    id: 'evt-104',
    title: 'National NGO & Public Sector Leadership Forum',
    slug: 'ngo-leadership-forum-abuja',
    organizer: 'Development Horizons Africa',
    organizerVerified: true,
    category: 'Conference',
    date: 'Wednesday, Jan 19, 2028',
    time: '08:30 AM WAT',
    venue: 'Transcorp Hilton Congress Hall, Maitama',
    city: 'Abuja',
    state: 'FCT',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    description: 'Gathering policymakers, civil society executives, multilateral development partners, and community advocates to establish 2028 collaborative frameworks.',
    startingPrice: 0, // Free event
    currency: 'NGN',
    ticketsSold: 420,
    capacity: 600,
    featured: false,
    editorialTag: 'CIVIC & DEVELOPMENT DIPLOMACY',
    schedule: [
      { time: '08:30 AM', title: 'Registration & Delegate Accreditation', description: 'Check in with Eventory QR confirmation.' },
      { time: '09:30 AM', title: 'Ministerial Address & Opening Plenary', description: 'National Strategy for Civic Impact.' }
    ],
    ticketTiers: [
      { id: 'tier-ngo1', name: 'Delegate RSVP (Free)', price: 0, description: 'Complimentary registration for accredited development practitioners and civic leaders.', remaining: 180 }
    ],
    faqs: [
      { question: 'Are delegate badges issued in advance?', answer: 'Digital QR passes are issued immediately upon confirmation. Physical badges printed on arrival.' }
    ],
    refundPolicy: 'Free RSVP cancellation requested if unable to attend so waitlisted delegates can be admitted.'
  },
  {
    id: 'evt-105',
    title: 'The Luxe Wedding Showcase & Bridal Expo',
    slug: 'luxe-wedding-showcase-abuja',
    organizer: 'Eventory Nexus Weddings',
    organizerVerified: true,
    category: 'Social & Wedding',
    date: 'Saturday, Feb 12, 2028',
    time: '11:00 AM WAT',
    venue: 'The Wells Carlton Grand Ballroom, Asokoro',
    city: 'Abuja',
    state: 'FCT',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Meet Abuja’s top decor designers, couture bridal dressmakers, artisanal bakers, luxury transport services, and live bands under one roof with curated runways.',
    startingPrice: 5000,
    currency: 'NGN',
    ticketsSold: 280,
    capacity: 500,
    featured: false,
    editorialTag: 'BRIDAL LUXURY & STYLING',
    schedule: [
      { time: '11:00 AM', title: 'Exhibition Hall Opens', description: 'Meet 40+ curated wedding vendors.' },
      { time: '02:00 PM', title: 'Haute Couture Bridal Runway Presentation', description: '2028 bridal collection preview.' }
    ],
    ticketTiers: [
      { id: 'tier-ws1', name: 'Bride & Groom Couple Pass', price: 8000, description: 'Pass for 2 guests + direct consultation booking slot with top 3 vendors.', remaining: 110 },
      { id: 'tier-ws2', name: 'General Visitor', price: 5000, description: 'Single entry ticket to exhibition halls and runway presentations.', remaining: 110 }
    ],
    faqs: [
      { question: 'Can I book vendor consultations during the expo?', answer: 'Yes, each ticket includes fast-track consultation requests through the Eventory App.' }
    ],
    refundPolicy: 'Full refund available up to 48 hours before the showcase.'
  },
  {
    id: 'evt-106',
    title: 'Abuja Creative Creators & Podcasters Workshop',
    slug: 'creators-workshop-abuja',
    organizer: 'Studio Abuja Co-working',
    organizerVerified: false,
    category: 'Workshops',
    date: 'Thursday, Mar 04, 2028',
    time: '02:00 PM WAT',
    venue: 'Founders Space, Wuse 2',
    city: 'Abuja',
    state: 'FCT',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    description: 'Hands-on masterclass on lighting, studio microphones, distribution monetization, and podcast editing using modern AI workflows.',
    startingPrice: 10000,
    currency: 'NGN',
    ticketsSold: 42,
    capacity: 60,
    featured: false,
    editorialTag: 'HANDS-ON CREATIVE PRODUCTION',
    schedule: [
      { time: '02:00 PM', title: 'Acoustics & Microphone Setup Lab', description: 'Hands-on hardware testing.' },
      { time: '04:00 PM', title: 'Monetization & Syndication Strategy', description: 'Building sponsorships for African podcasts.' }
    ],
    ticketTiers: [
      { id: 'tier-cr1', name: 'Workshop Seat', price: 10000, description: 'Includes workbook, equipment practice time, and audio plugin discounts.', remaining: 18 }
    ],
    faqs: [
      { question: 'Do I need to bring audio equipment?', answer: 'No, studio microphones and recording interfaces are provided for practice.' }
    ],
    refundPolicy: 'Refunds permitted up to 3 days prior.'
  }
];

export const INITIAL_VENDORS: VendorItem[] = [
  {
    id: 'vnd-01',
    businessName: 'ABC Events & Royal Catering',
    category: 'Catering',
    city: 'Abuja',
    locationAddress: 'Plot 412, Cadastral Zone, Gwarinpa & Maitama',
    guestCapacity: '50 – 1,000 guests',
    priceFrom: 450000,
    rating: 4.9,
    reviewsCount: 68,
    responseRate: '99% within 1 hour',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1492038',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Specialists in multi-course Nigerian banquets (Jollof, Fried Rice, Pounded Yam, Soups, Asun grills), live small-chops stations, and international continental buffets for corporate banquets and luxury weddings.',
    servicesIncluded: ['Full banquet staffing', 'Table cutlery & glassware', 'Live carving station', 'Complimentary food tasting session'],
    bookedCount: 142,
    packages: [
      { id: 'pkg-c1', name: 'Silver Corporate Luncheon', price: 450000, description: 'Ideal for board meetings and seminars up to 100 guests.', features: ['3-Course Buffet', 'Cocktails & Mocktails', 'Full Cutlery & Waitstaff'] },
      { id: 'pkg-c2', name: 'Gold Royal Wedding Banquet', price: 1350000, description: 'Complete banquet for 300 to 500 wedding guests.', features: ['5-Course Nigerian & Continental Menu', 'Live Grills & Small Chops Station', 'Executive Tableware', 'Dedicated Captain & 18 Waitstaff'] },
      { id: 'pkg-c3', name: 'Presidential Diplomatic Feast', price: 2800000, description: 'Ultra-luxury multi-tier dining experience for up to 1,000 guests.', features: ['Customized Menu with Private Tasting', 'Artisanal Dessert Bar', 'VIP Table Silverware', 'Full Culinary Management'] }
    ],
    reviews: [
      { id: 'rev-c1', author: 'Dr. Aliyu Mohammed', eventType: 'State Medical Conference', date: 'October 2026', rating: 5, comment: 'ABC Catering served over 400 delegates hot, delicious banquets on time without a single queue delay.' },
      { id: 'rev-c2', author: 'Ngozi Eze', eventType: 'Traditional Wedding', date: 'August 2026', rating: 5, comment: 'The live asun station and small chops were the absolute talk of our wedding. Highly professional team.' }
    ]
  },
  {
    id: 'vnd-02',
    businessName: 'The Sapphire Marquee & Conference Palace',
    category: 'Venues',
    city: 'Abuja',
    locationAddress: 'Adjacent Diplomatic Zone, Central Business District, Abuja',
    guestCapacity: '200 – 1,500 guests',
    priceFrom: 2200000,
    rating: 4.95,
    reviewsCount: 94,
    responseRate: '100% within 30 mins',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1102984',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Fully air-conditioned luxury glass marquee with 2 dedicated 500kVA backup diesel generators, 300+ secured parking bays, presidential green rooms, and CCTV monitoring.',
    servicesIncluded: ['500kVA dual power backup', 'Luxury chiavari chairs', 'Round banquet tables', 'Dedicated cleaning crew'],
    bookedCount: 88,
    packages: [
      { id: 'pkg-v1', name: 'Full Day Grand Hall Hire', price: 2200000, description: 'Exclusive 24-hour access to the main marquee and grounds.', features: ['Dual 500kVA Generator Fuel Included', '400 Chiavari Chairs', '40 Round Banquet Tables', 'VIP Changing Suites'] },
      { id: 'pkg-v2', name: 'Multi-Day Conference Package', price: 3800000, description: '48-hour access for international summits and setup.', features: ['Full Hall Access 2 Days', 'Exhibition Foyer Included', 'Sound & Projector Rig Support', 'Overnight Security Guarding'] }
    ],
    reviews: [
      { id: 'rev-v1', author: 'Stephen Adeleke', eventType: 'Royal Wedding', date: 'October 2026', rating: 5, comment: 'The air conditioning kept 450 guests completely cool in the middle of a hot Abuja afternoon. Zero power flickers.' }
    ]
  },
  {
    id: 'vnd-03',
    businessName: 'Lush Petals & Ambient Luxe Decor',
    category: 'Decoration',
    city: 'Abuja',
    locationAddress: 'Adetokunbo Ademola Crescent, Wuse 2, Abuja',
    guestCapacity: '100 – 800 guests',
    priceFrom: 850000,
    rating: 4.88,
    reviewsCount: 52,
    responseRate: '95% within 2 hours',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1392811',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Bespoke event architecture, fresh botanical arches, cascading crystal chandeliers, custom neon monograms, ambient ceiling draping, and luxury stage sets.',
    servicesIncluded: ['3D event mockups', 'Fresh imported floral arrangements', 'LED mood uplighting', 'Walkway carpeting'],
    bookedCount: 110,
    packages: [
      { id: 'pkg-d1', name: 'Corporate Stage & Ambient Package', price: 850000, description: 'Crisp, contemporary branding and podium backdrop.', features: ['3D Stage Set', 'Branded Media Wall', 'LED Mood Lighting'] },
      { id: 'pkg-d2', name: 'Luxury Fairytale Wedding Decor', price: 1750000, description: 'Full hall transformation with botanical ceiling draping.', features: ['High Table Floral Arch', 'Walkway Carpet & Chandeliers', 'Custom Monogram', 'All Guest Table Centerpieces'] }
    ],
    reviews: [
      { id: 'rev-d1', author: 'Chioma Okeke', eventType: 'Wedding Ceremony', date: 'September 2026', rating: 5, comment: 'The 3D render Lush Petals shared looked identical to what they built on event day. Truly world-class styling.' }
    ]
  },
  {
    id: 'vnd-04',
    businessName: 'Krown Cinematic Media & Studio',
    category: 'Photography',
    city: 'Abuja',
    locationAddress: 'Shehu Shagari Way, Maitama, Abuja',
    guestCapacity: 'All event sizes',
    priceFrom: 400000,
    rating: 4.92,
    reviewsCount: 47,
    responseRate: '98% within 1 hour',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1829302',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80'
    ],
    description: '4K cinema-grade multicam coverage, licensed drone aerial footage, live video streaming to YouTube/Zoom, and luxury leatherbound layflat photo books.',
    servicesIncluded: ['2 Lead photographers + 2 Cinematographers', '4K Drone operator', 'Same-day highlight teaser reel', 'Online cloud gallery'],
    bookedCount: 76,
    packages: [
      { id: 'pkg-p1', name: 'Cinema Documentarian Package', price: 400000, description: 'Full day photo and video coverage.', features: ['2 Cameras 4K', 'Drone Aerials', 'Teaser Reel', 'All High-Res Stills'] }
    ],
    reviews: [
      { id: 'rev-p1', author: 'Babatunde Adeleke', eventType: 'Corporate Summit', date: 'July 2026', rating: 5, comment: 'They delivered our same-day teaser reel before the closing dinner ended. Incredible speed and sharpness.' }
    ]
  },
  {
    id: 'vnd-05',
    businessName: 'Acoustic Waves & DJ Blaze Pro Sound',
    category: 'Sound & DJ',
    city: 'Abuja',
    locationAddress: 'Garki 2 Commercial District, Abuja',
    guestCapacity: '100 – 2,500 guests',
    priceFrom: 350000,
    rating: 4.85,
    reviewsCount: 39,
    responseRate: '96% within 1 hour',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1928471',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Line-array concert sound systems, wireless Sennheiser microphone kits, digital mixers, professional club DJ pairing, and haze/dry ice stage special effects.',
    servicesIncluded: ['Line array sound system', 'Pro event DJ & audio engineer', 'Dry ice cloud for entrance', 'Wireless mic sets'],
    bookedCount: 92,
    packages: [
      { id: 'pkg-s1', name: 'Full Concert Audio & DJ Package', price: 350000, description: 'Ideal for banquets and celebrations up to 1,000 guests.', features: ['Line Array Sound', 'Sennheiser Wireless Mics', 'DJ Setup', 'Dry Ice Cloud'] }
    ],
    reviews: [
      { id: 'rev-s1', author: 'Kemi Balogun', eventType: 'Gala Dinner', date: 'June 2026', rating: 5, comment: 'Crisp audio throughout the whole marquee. Speeches were crystal clear and the music kept guests on the dance floor.' }
    ]
  },
  {
    id: 'vnd-06',
    businessName: 'ShieldPro VIP Protection & Security',
    category: 'Security',
    city: 'Abuja',
    locationAddress: 'Area 11, Garki, Abuja',
    guestCapacity: 'Up to 5,000 guests',
    priceFrom: 280000,
    rating: 4.96,
    reviewsCount: 54,
    responseRate: '99% within 30 mins',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1728192',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Uniformed and tactical event security marshals, metal detector walk-through gates, VIP close protection, bag checking, and traffic control coordination.',
    servicesIncluded: ['Walk-through metal detectors', 'Uniformed marshals', 'Crowd flow control', 'Dedicated VIP escorts'],
    bookedCount: 120,
    packages: [
      { id: 'pkg-sec1', name: 'Tactical Event Marshal Unit', price: 280000, description: '10 Uniformed marshals + 2 Metal detector arches.', features: ['Access Control', 'Vehicle Traffic Marshaling', 'VIP Close Escort'] }
    ],
    reviews: [
      { id: 'rev-sec1', author: 'Col. Danjuma (Rtd)', eventType: 'High-Level Summit', date: 'May 2026', rating: 5, comment: 'Discreet, polite, and exceptionally alert security team.' }
    ]
  },
  {
    id: 'vnd-07',
    businessName: 'Royal Fleet Executive Bus & Chauffeur Services',
    category: 'Transportation',
    city: 'Abuja',
    locationAddress: 'Nnamdi Azikiwe Airport Expressway, Abuja',
    guestCapacity: '18 – 300 passengers',
    priceFrom: 320000,
    rating: 4.87,
    reviewsCount: 31,
    responseRate: '94% within 2 hours',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1627384',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Luxury Coaster executive buses, Prado SUVs, and Mercedes bridal convoys for guest airport shuttles, hotel transfers, and VIP motorcade logistics.',
    servicesIncluded: ['Professional suited drivers', 'Fuel and vehicle insurance included', 'Air-conditioned luxury coasters', 'Flight tracking dispatch'],
    bookedCount: 45,
    packages: [
      { id: 'pkg-t1', name: '3-Bus Airport & Hotel Shuttle', price: 320000, description: 'Daily shuttle rotation for out-of-town delegates.', features: ['3 Coaster Buses (30 Seats each)', 'Fuel Included', 'Suited Drivers', 'Flight Monitor'] }
    ],
    reviews: [
      { id: 'rev-t1', author: 'Prof. Ibrahim Garba', eventType: 'Academic Summit', date: 'August 2026', rating: 5, comment: 'On-time pickup from Nnamdi Azikiwe Airport right to Transcorp Hilton without friction.' }
    ]
  },
  {
    id: 'vnd-08',
    businessName: 'Elegance Elite Ushers & Hostesses',
    category: 'Ushers & Support',
    city: 'Abuja',
    locationAddress: 'Jabi Lake Promenade, Abuja',
    guestCapacity: '50 – 1,200 guests',
    priceFrom: 180000,
    rating: 4.93,
    reviewsCount: 63,
    responseRate: '100% within 1 hour',
    verified: true,
    cacRegistered: true,
    cacNumber: 'RC-1524319',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Polished, bilingual, professionally groomed protocol hostesses and ushers trained in digital QR gate scanning, guest seating escort, and VIP banquet service.',
    servicesIncluded: ['Branded elegant uniform options', 'Pre-event briefing coordination', 'Digital scanner tablet operation', 'VIP table coordination'],
    bookedCount: 165,
    packages: [
      { id: 'pkg-u1', name: '10 Protocol Hostesses Unit', price: 180000, description: 'Trained QR ticket scanners and guest seating guides.', features: ['Uniform of Choice', 'Eventory Scanner Operation', 'VIP Seating Guides'] }
    ],
    reviews: [
      { id: 'rev-u1', author: 'Halima (Lead Planner)', eventType: 'Royal Wedding', date: 'October 2026', rating: 5, comment: 'Their QR check-in scanning cut entrance wait times by 80%. Exceptional protocol demeanor.' }
    ]
  }
];

export const INITIAL_WORKSPACE: ActiveWorkspace = {
  id: 'ws-stephen-wedding',
  title: "Stephen & Chioma's Royal Wedding",
  eventDate: '15 December 2027',
  targetGuests: 450,
  venueName: 'The Sapphire Marquee & Palace, CBD Abuja',
  city: 'Abuja, Nigeria',
  registeredGuests: 312,
  bookedVendors: 9,
  activeTasks: 18,
  totalBudget: 5050000,
  totalPaid: 4200000,
  totalOutstanding: 850000,
  tasks: [
    { id: 'tsk-01', title: 'Confirm final banquet menu choice with ABC Catering', category: 'Catering', assignee: 'Chioma (Bride)', dueDate: 'Nov 10, 2027', status: 'completed', priority: 'high' },
    { id: 'tsk-02', title: 'Schedule dry-run walkthrough with venue manager', category: 'Venue', assignee: 'Stephen (Groom)', dueDate: 'Nov 18, 2027', status: 'completed', priority: 'medium' },
    { id: 'tsk-03', title: 'Approve custom 3D floral arch backdrop design', category: 'Venue', assignee: 'Lush Petals Studio', dueDate: 'Nov 24, 2027', status: 'in_progress', priority: 'high' },
    { id: 'tsk-04', title: 'Send digital QR tickets & table allocations to VIP guests', category: 'Guest', assignee: 'Eventory System', dueDate: 'Dec 01, 2027', status: 'in_progress', priority: 'high' },
    { id: 'tsk-05', title: 'Balance ₦850k final vendor milestone payment', category: 'Logistics', assignee: 'Stephen (Groom)', dueDate: 'Dec 05, 2027', status: 'pending', priority: 'high' },
    { id: 'tsk-06', title: 'Brief 12 Ushers & test Eventory QR gate scanner tablets', category: 'Logistics', assignee: 'Elegance Elite Lead', dueDate: 'Dec 12, 2027', status: 'pending', priority: 'medium' },
    { id: 'tsk-07', title: 'Coordinate airport shuttle for Lagos & UK family delegates', category: 'Logistics', assignee: 'Royal Fleet Chauffeurs', dueDate: 'Dec 14, 2027', status: 'pending', priority: 'high' },
    { id: 'tsk-08', title: 'DJ playlist handover & entrance song cues', category: 'Media', assignee: 'DJ Blaze Pro', dueDate: 'Dec 10, 2027', status: 'in_progress', priority: 'medium' }
  ],
  guests: [
    { id: 'gst-01', name: 'Dr. Aliyu Mohammed', email: 'aliyu.m@domain.ng', phone: '+234 803 234 5678', ticketType: 'VIP', ticketCode: 'EVT-STW-001', checkedIn: true, checkInTime: '01:14 PM', paymentStatus: 'paid', tableNumber: 'Table 1 (High Table)' },
    { id: 'gst-02', name: 'Barrister (Mrs.) Amaka Okonkwo', email: 'amaka.law@domain.ng', phone: '+234 802 887 6543', ticketType: 'VIP', ticketCode: 'EVT-STW-002', checkedIn: true, checkInTime: '01:25 PM', paymentStatus: 'paid', tableNumber: 'Table 1 (High Table)' },
    { id: 'gst-03', name: 'Engr. Babatunde Adeleke', email: 'b.adeleke@buildcorp.ng', phone: '+234 805 112 3456', ticketType: 'Regular', ticketCode: 'EVT-STW-003', checkedIn: false, paymentStatus: 'paid', tableNumber: 'Table 4' },
    { id: 'gst-04', name: 'Senator & Mrs. K. Bello', email: 'k.bello@senate.gov.ng', phone: '+234 809 333 4455', ticketType: 'VIP', ticketCode: 'EVT-STW-004', checkedIn: false, paymentStatus: 'paid', tableNumber: 'Table 2 (Diplomatic)' },
    { id: 'gst-05', name: 'Zainab Danjuma', email: 'zainab.d@horizon.ng', phone: '+234 814 667 8901', ticketType: 'Regular', ticketCode: 'EVT-STW-005', checkedIn: true, checkInTime: '01:42 PM', paymentStatus: 'paid', tableNumber: 'Table 6' },
    { id: 'gst-06', name: 'Emeka Nwosu', email: 'emeka.n@techabuja.com', phone: '+234 818 998 7766', ticketType: 'Guest RSVP', ticketCode: 'EVT-STW-006', checkedIn: false, paymentStatus: 'complimentary', tableNumber: 'Table 8' },
    { id: 'gst-07', name: 'Folake Adelegan', email: 'folake@artisanbakes.ng', phone: '+234 703 554 4321', ticketType: 'Regular', ticketCode: 'EVT-STW-007', checkedIn: false, paymentStatus: 'paid', tableNumber: 'Table 5' },
    { id: 'gst-08', name: 'Prof. Ibrahim Garba', email: 'i.garba@uniabuja.edu.ng', phone: '+234 802 121 2121', ticketType: 'VIP', ticketCode: 'EVT-STW-008', checkedIn: false, paymentStatus: 'paid', tableNumber: 'Table 2 (Diplomatic)' }
  ],
  invoices: [
    { id: 'inv-01', vendorName: 'The Sapphire Marquee', serviceCategory: 'Venue Rental', amount: 2200000, paidAmount: 2200000, status: 'paid', dueDate: 'Oct 01, 2027', invoiceNumber: 'INV-SPH-2027-08' },
    { id: 'inv-02', vendorName: 'ABC Events & Catering', serviceCategory: 'Catering & Banquets', amount: 1350000, paidAmount: 1000000, status: 'partially_paid', dueDate: 'Nov 30, 2027', invoiceNumber: 'INV-ABC-9902' },
    { id: 'inv-03', vendorName: 'Lush Petals & Ambient Luxe', serviceCategory: 'Event Decoration', amount: 850000, paidAmount: 500000, status: 'partially_paid', dueDate: 'Dec 05, 2027', invoiceNumber: 'INV-LSH-0412' },
    { id: 'inv-04', vendorName: 'Krown Cinematic Media', serviceCategory: 'Photo & Drone Video', amount: 400000, paidAmount: 400000, status: 'paid', dueDate: 'Nov 15, 2027', invoiceNumber: 'INV-KRN-118' },
    { id: 'inv-05', vendorName: 'ShieldPro VIP Protection', serviceCategory: 'Security & Walk-through', amount: 250000, paidAmount: 100000, status: 'pending_approval', dueDate: 'Dec 10, 2027', invoiceNumber: 'INV-SHD-0045' }
  ],
  quotes: [
    { id: 'qt-01', vendorName: 'Royal Fleet Luxury Buses', category: 'Transportation', quotedAmount: 320000, submittedDate: '24 Oct 2027', details: '3 Executive 30-seater coasters for airport to hotel guest transfers over 2 days.', status: 'approved' },
    { id: 'qt-02', vendorName: 'Acoustic Waves & DJ Blaze', category: 'Sound & Lighting', quotedAmount: 350000, submittedDate: '26 Oct 2027', details: 'Full concert line-array sound, wireless lapels for pastor/officiants, dry ice cloud entrance.', status: 'approved' },
    { id: 'qt-03', vendorName: 'Abuja Artisan Cocktail Bar', category: 'Drinks & Bar', quotedAmount: 290000, submittedDate: '02 Nov 2027', details: 'Unlimited craft mocktails, signature groom & bride cocktail bar for 450 guests.', status: 'pending' }
  ],
  chatMessages: [
    { id: 'msg-01', sender: 'Chioma (Bride)', role: 'Co-Organiser', message: 'Hello team! The decorator Lush Petals just updated their moodboard for the stage ceiling. Take a look in documents!', timestamp: 'Yesterday at 3:15 PM', avatarColor: 'bg-purple-600' },
    { id: 'msg-02', sender: 'Stephen (Groom)', role: 'Organiser', message: 'Looks stunning. I just approved the ₦500k milestone for the decor. Outstanding balance is ₦350k.', timestamp: 'Yesterday at 4:20 PM', avatarColor: 'bg-[#301d6e]' },
    { id: 'msg-03', sender: 'Halima (Lead Planner)', role: 'Event Manager', message: 'Noted Stephen! Also, 312 out of 450 guests have completed their digital RSVP on Eventory. QR codes are being generated seamlessly.', timestamp: 'Today at 10:14 AM', avatarColor: 'bg-[#8ec82d]' },
    { id: 'msg-04', sender: 'DJ Blaze', role: 'Sound Vendor', message: 'Good morning planners! Sound engineer walkthrough at Sapphire Marquee confirmed for 11 AM next Tuesday.', timestamp: 'Today at 11:30 AM', avatarColor: 'bg-amber-600' }
  ],
  documents: [
    { id: 'doc-01', title: 'Sapphire Marquee Venue Lease Agreement.pdf', category: 'Contracts', fileType: 'PDF', size: '2.4 MB', updatedDate: '12 Oct 2027' },
    { id: 'doc-02', title: 'Wedding Day Run-of-Show Protocol.docx', category: 'Schedules', fileType: 'DOCX', size: '840 KB', updatedDate: '28 Oct 2027' },
    { id: 'doc-03', title: 'Grand Ballroom Seating Floorplan & Table Matrix.pdf', category: 'Floorplans', fileType: 'PDF', size: '4.1 MB', updatedDate: '02 Nov 2027' },
    { id: 'doc-04', title: 'Consolidated Vendor Escrow Budget Milestone Sheet.xlsx', category: 'Budgets', fileType: 'XLSX', size: '1.2 MB', updatedDate: '05 Nov 2027' }
  ]
};

export const INITIAL_VENDOR_ENQUIRIES: VendorEnquiry[] = [
  {
    id: 'enq-01',
    eventTitle: "Stephen & Chioma's Royal Wedding",
    organizerName: 'Stephen Adeleke',
    organizerPhone: '+234 803 234 5678',
    organizerEmail: 'stephen.a@adeleke.ng',
    date: '15 December 2027',
    guestCount: 450,
    budgetEstimated: 1500000,
    status: 'quoted',
    notes: 'Multi-course Nigerian banquet with live grill station, Jollof, small chops for 450 guests in Maitama.',
    receivedTime: '2 hours ago'
  },
  {
    id: 'enq-02',
    eventTitle: 'West Africa Energy Transition Summit Dinner',
    organizerName: 'Engr. Fatima Usman',
    organizerPhone: '+234 802 110 9988',
    organizerEmail: 'fatima@energyafrica.org',
    date: '22 January 2028',
    guestCount: 220,
    budgetEstimated: 950000,
    status: 'pending',
    notes: 'Executive 3-course plated dinner for international ministers and energy ambassadors at ICC Abuja.',
    receivedTime: 'Yesterday'
  },
  {
    id: 'enq-03',
    eventTitle: 'TechFounders Abuja End-of-Year Mixer',
    organizerName: 'Kenechukwu Obi',
    organizerPhone: '+234 814 332 1100',
    organizerEmail: 'kene@techbuilders.ng',
    date: '19 December 2027',
    guestCount: 150,
    budgetEstimated: 600000,
    status: 'pending',
    notes: 'Finger foods, mocktail cocktail station, sliders, and dessert bar for tech entrepreneurs in Wuse 2.',
    receivedTime: '3 days ago'
  }
];

export const INITIAL_VENDOR_BOOKINGS: VendorBooking[] = [
  {
    id: 'bkg-01',
    clientName: 'Stephen Adeleke',
    eventTitle: "Stephen & Chioma's Royal Wedding",
    date: '15 Dec 2027',
    venue: 'The Sapphire Marquee, CBD Abuja',
    amount: 1350000,
    depositStatus: 'paid',
    bookingStatus: 'confirmed'
  },
  {
    id: 'bkg-02',
    clientName: 'Nexus Ventures Africa',
    eventTitle: 'Abuja Tech Summit Gala',
    date: '14 Nov 2027',
    venue: 'ICC Main Banquet Hall',
    amount: 900000,
    depositStatus: 'paid',
    bookingStatus: 'confirmed'
  },
  {
    id: 'bkg-03',
    clientName: 'Dr. Aliyu Mohammed',
    eventTitle: 'National Medical Guild Luncheon',
    date: '08 Jan 2028',
    venue: 'Wells Carlton Hotel, Asokoro',
    amount: 650000,
    depositStatus: 'pending',
    bookingStatus: 'in_progress'
  }
];
