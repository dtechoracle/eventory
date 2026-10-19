'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEventory } from '../../../../context/EventoryContext';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { EventItem } from '../../../../types';
import { 
  ArrowLeft, Calendar, MapPin, Sparkles, Upload, 
  Bold, Italic, Strikethrough, Link2, Quote, Code, 
  List, ListOrdered, Undo, Redo, Plus, Trash2, 
  Check, Info, ChevronDown, CheckCircle2, Ticket, Image as ImageIcon
} from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const { currentUser, createEvent, showToast } = useEventory();

  // Stepper state: 'details' | 'appearance' | 'tickets'
  const [currentStep, setCurrentStep] = useState<'details' | 'appearance' | 'tickets'>('details');

  // STEP 1: Details
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState<'Abuja' | 'Lagos' | 'Port Harcourt' | 'Online'>('Abuja');
  const [isVirtual, setIsVirtual] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [eventFormat, setEventFormat] = useState('Conference');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Tech & Business']);
  const [scheduleType, setScheduleType] = useState<'single' | 'recurring'>('single');
  const [startDate, setStartDate] = useState('2027-04-15');
  const [startTime, setStartTime] = useState('10:00');
  const [startTimePeriod, setStartTimePeriod] = useState<'AM' | 'PM'>('AM');
  const [endDate, setEndDate] = useState('2027-04-15');
  const [endTime, setEndTime] = useState('06:00');
  const [endTimePeriod, setEndTimePeriod] = useState<'AM' | 'PM'>('PM');
  const [lineupTitle, setLineupTitle] = useState('Keynote Speakers');
  const [lineupItems, setLineupItems] = useState<{ id: string; name: string; role: string }[]>([
    { id: '1', name: 'Dr. Amina Bello', role: 'Founder & CEO, TechNexus' }
  ]);
  const [newLineupName, setNewLineupName] = useState('');
  const [newLineupRole, setNewLineupRole] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');

  // STEP 2: Appearance
  const [eventImage, setEventImage] = useState(
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'
  );
  const [accentColor, setAccentColor] = useState('#301d6e');

  const presetImages = [
    { label: 'Conference & Summit', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80' },
    { label: 'Concert & Music', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80' },
    { label: 'Tech & Innovation', url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80' },
    { label: 'Festival & Food', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80' },
  ];

  // STEP 3: Tickets
  const [ticketTiers, setTicketTiers] = useState<
    { id: string; name: string; price: number; description: string; remaining: number }[]
  >([
    { id: 't1', name: 'Regular Access', price: 5000, description: 'General seating and digital badge entry', remaining: 250 },
    { id: 't2', name: 'VIP Executive Pass', price: 25000, description: 'Front-row priority seating, summit luncheon, VIP networking lounge', remaining: 50 }
  ]);
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState<number>(0);
  const [newTierQty, setNewTierQty] = useState<number>(100);
  const [newTierDesc, setNewTierDesc] = useState('');

  // Category chip options (Matching media_1792369732033.png)
  const categoryChips = [
    'Democracy', 'Politics and Practice', 'Wellness', 'Visual Arts', 
    'Books and Literature', 'Gender and Equality', 'Shopping', 'Pastor', 
    'Children', 'Parties and Festivals', 'Hiking', 'Kayaking', 
    'Travel and Outdoor', 'Dance', 'Christianity', 'Ramadan', 'Eid', 
    'Islam', 'Podcasts', 'Improv', 'Entrepreneurship', 'Theatre', 
    'Poetry and Spoken Word', 'Tech & Business', 'Music & Concert'
  ];

  const handleToggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddLineup = () => {
    if (!newLineupName.trim()) return;
    setLineupItems([
      ...lineupItems,
      { id: Date.now().toString(), name: newLineupName, role: newLineupRole || 'Featured Speaker' }
    ]);
    setNewLineupName('');
    setNewLineupRole('');
  };

  const handleRemoveLineup = (id: string) => {
    setLineupItems(lineupItems.filter((item) => item.id !== id));
  };

  const handleAddTicketTier = () => {
    if (!newTierName.trim()) return;
    setTicketTiers([
      ...ticketTiers,
      {
        id: `tier-${Date.now().toString().slice(-4)}`,
        name: newTierName,
        price: Number(newTierPrice) || 0,
        description: newTierDesc || 'Standard admission pass',
        remaining: Number(newTierQty) || 50
      }
    ]);
    setNewTierName('');
    setNewTierPrice(0);
    setNewTierQty(100);
    setNewTierDesc('');
  };

  const handleRemoveTier = (id: string) => {
    if (ticketTiers.length <= 1) {
      alert('You must have at least one ticket tier.');
      return;
    }
    setTicketTiers(ticketTiers.filter((t) => t.id !== id));
  };

  const handleProceedToAppearance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!eventName.trim()) {
      alert('Please provide an event name.');
      return;
    }
    setCurrentStep('appearance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToTickets = () => {
    setCurrentStep('tickets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishEvent = () => {
    if (ticketTiers.length === 0) {
      alert('Please configure at least one ticket tier.');
      return;
    }

    const startingPrice = Math.min(...ticketTiers.map((t) => t.price));
    const createdId = `evt-${Date.now().toString().slice(-4)}`;

    const newEvent: EventItem = {
      id: createdId,
      title: eventName,
      slug: customSlug || eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
      organizer: currentUser.name || 'Ezekiel Adeleke',
      organizerVerified: true,
      category: (selectedCategories[0] as any) || 'Conference',
      date: `${startDate} (${scheduleType === 'single' ? 'Single Event' : 'Recurring'})`,
      time: `${startTime} ${startTimePeriod} - ${endTime} ${endTimePeriod}`,
      venue: isVirtual ? 'Virtual Event Link' : venue || 'Abuja International Conference Centre',
      city: isVirtual ? 'Online' : city,
      state: city,
      image: eventImage,
      description: description || `${eventName} is an upcoming experience organized by ${currentUser.name}. Join us for insights, networking, and memorable moments.`,
      startingPrice,
      currency: 'NGN',
      ticketsSold: 0,
      capacity: ticketTiers.reduce((acc, t) => acc + t.remaining, 0),
      ticketTiers
    };

    createEvent(newEvent);
    showToast(`🎉 Event "${eventName}" published successfully!`);
    router.push('/dashboard/events');
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden pb-12">
        
        {/* Top Bar with Back and Stepper (Matching media_1792369713434.png) */}
        <div className="bg-white border-b border-slate-100 z-10 px-4 sm:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {/* Back button */}
          <Link
            href="/dashboard/events"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          {/* Stepper Dots (Details -> Appearance -> Tickets) */}
          <div className="flex items-center gap-6 sm:gap-10 text-xs font-bold">
            <button
              onClick={() => setCurrentStep('details')}
              className={`flex items-center gap-2 cursor-pointer ${
                currentStep === 'details' ? 'text-[#301d6e]' : 'text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentStep === 'details' ? 'bg-[#8ec82d]' : 'bg-slate-300'}`}></span>
              <span>Details</span>
            </button>

            <button
              onClick={() => {
                if (!eventName.trim()) {
                  alert('Please enter event name first.');
                  return;
                }
                setCurrentStep('appearance');
              }}
              className={`flex items-center gap-2 cursor-pointer ${
                currentStep === 'appearance' ? 'text-[#301d6e]' : 'text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentStep === 'appearance' ? 'bg-[#8ec82d]' : 'bg-slate-300'}`}></span>
              <span>Appearance</span>
            </button>

            <button
              onClick={() => {
                if (!eventName.trim()) {
                  alert('Please enter event name first.');
                  return;
                }
                setCurrentStep('tickets');
              }}
              className={`flex items-center gap-2 cursor-pointer ${
                currentStep === 'tickets' ? 'text-[#301d6e]' : 'text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentStep === 'tickets' ? 'bg-[#8ec82d]' : 'bg-slate-300'}`}></span>
              <span>Tickets</span>
            </button>
          </div>

          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
        
        {/* STEP 1: DETAILS (Matching media_1792369713434.png & media_1792369732033.png) */}
        {currentStep === 'details' && (
          <div className="space-y-10">
            
            {/* Header Greeting */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Hi {currentUser.name ? currentUser.name.split(' ')[0] : 'Ezekiel'},
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Let's start with the basics
              </p>
            </div>

            {/* SECTION 1: Event Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Event details
              </h2>

              {/* Event Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>* Event name</span>
                  <span className="text-slate-400">{eventName.length}/75</span>
                </div>
                <input
                  type="text"
                  maxLength={75}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Event name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] transition-all"
                />
              </div>

              {/* Describe your event (Rich text toolbar) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * Describe your event
                </label>
                
                {/* Formatting Toolbar */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <div className="flex items-center gap-1 p-2 bg-slate-50/70 border-b border-slate-200 overflow-x-auto text-slate-600">
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold" title="Bold">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Italic">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Strikethrough">
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Link">
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Quote">
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Code">
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Bullet list">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Numbered list">
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Undo">
                      <Undo className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-xs" title="Redo">
                      <Redo className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell attendees what makes your event special, what to expect, dress code, and key milestones..."
                    className="w-full p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-y"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Event Location */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Event location
              </h2>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * Country
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none cursor-pointer"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Location Venue */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * Location of event
                </label>
                <input
                  type="text"
                  disabled={isVirtual}
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Search for venue or address (e.g. The Dome, CBD Abuja)"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              {/* Virtual Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVirtual(!isVirtual)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    isVirtual ? 'bg-[#301d6e]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      isVirtual ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-700">
                  This is a virtual event
                </span>
              </div>

              {/* Custom URL */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Use custom URL
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#301d6e]">
                  <span className="px-4 py-3 bg-slate-50 text-slate-500 text-xs font-semibold border-r border-slate-200 shrink-0">
                    eventory.nexus/events/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="special-listening-party"
                    className="w-full px-3 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Special characters like &*%$ are not allowed
                </p>
              </div>
            </div>

            {/* SECTION 3: Event Format */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Event format
              </h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * What does your event feel like?
                </label>
                <div className="relative">
                  <select
                    value={eventFormat}
                    onChange={(e) => setEventFormat(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none cursor-pointer"
                  >
                    <option value="Conference">Conference & Summit</option>
                    <option value="Concert">Concert & Live Performance</option>
                    <option value="Festival">Festival & Cultural Gathering</option>
                    <option value="Party">Party, Club & Nightlife</option>
                    <option value="Networking">Networking & Business Mixer</option>
                    <option value="Workshop">Workshop & Masterclass</option>
                    <option value="Dinner">Gala, Dinner & Award Ceremony</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* SECTION 4: Event Category (Matching media_1792369732033.png) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Event Category
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose the category that best describes your event.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {categoryChips.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#301d6e] text-white border-[#301d6e] shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 5: Event Schedule */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Event schedule
              </h2>
              <p className="text-xs text-slate-500">
                Set the frequency, date and time
              </p>

              {/* Single / Recurring toggle buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleType('single')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    scheduleType === 'single'
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Single Event
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('recurring')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    scheduleType === 'recurring'
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Recurring Event
                </button>
              </div>

              {/* Time Zone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  * Choose a time zone
                </label>
                <div className="relative">
                  <select
                    defaultValue="wat"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none"
                  >
                    <option value="wat">(UTC+01:00) West Central Africa (Lagos, Abuja)</option>
                    <option value="gmt">(UTC+00:00) Greenwich Mean Time (Accra, London)</option>
                    <option value="eat">(UTC+03:00) East Africa Time (Nairobi)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">* Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">* Start Time</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                    />
                    <select
                      value={startTimePeriod}
                      onChange={(e) => setStartTimePeriod(e.target.value as any)}
                      className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* End Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">* End date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">* End Time</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                    />
                    <select
                      value={endTimePeriod}
                      onChange={(e) => setEndTimePeriod(e.target.value as any)}
                      className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: Event Lineup */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Event Lineup
                </h2>
                <p className="text-xs text-slate-500">
                  Showcase speakers, headliners, artists of your event
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Lineup title</label>
                <div className="relative">
                  <select
                    value={lineupTitle}
                    onChange={(e) => setLineupTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e] appearance-none"
                  >
                    <option value="Keynote Speakers">Keynote Speakers</option>
                    <option value="Performing Artists">Performing Artists</option>
                    <option value="Panelists & Moderators">Panelists & Moderators</option>
                    <option value="Special Guests">Special Guests</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Lineup items list */}
              {lineupItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <span className="text-[11px] text-slate-500">{item.role}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLineup(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add lineup fields */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Person / Performer Name"
                  value={newLineupName}
                  onChange={(e) => setNewLineupName(e.target.value)}
                  className="sm:col-span-6 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
                <input
                  type="text"
                  placeholder="Role / Title"
                  value={newLineupRole}
                  onChange={(e) => setNewLineupRole(e.target.value)}
                  className="sm:col-span-4 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
                <button
                  type="button"
                  onClick={handleAddLineup}
                  className="sm:col-span-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  showToast('Draft saved successfully');
                  router.push('/dashboard/events');
                }}
                className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleProceedToAppearance}
                className="px-8 py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Continue to Appearance
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: APPEARANCE */}
        {currentStep === 'appearance' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Event Appearance
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Upload your promotional artwork and select your brand accents.
              </p>
            </div>

            {/* Flyer Upload / Selection */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                * Event Flyer / Cover Artwork
              </label>

              {/* Current Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-80 group">
                <img
                  src={eventImage}
                  alt="Event flyer preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <span className="px-4 py-2 bg-white/95 rounded-xl text-xs font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#301d6e]" /> Live Flyer Preview
                  </span>
                </div>
              </div>

              {/* Preset selection */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-600 block">Choose artwork preset or enter custom image URL:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presetImages.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setEventImage(p.url)}
                      className={`p-2 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        eventImage === p.url
                          ? 'border-[#301d6e] bg-purple-50 text-[#301d6e] ring-1 ring-[#301d6e]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="h-14 rounded-lg overflow-hidden bg-slate-100 mb-1.5">
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="block truncate">{p.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="url"
                    value={eventImage}
                    onChange={(e) => setEventImage(e.target.value)}
                    placeholder="Or paste external image URL: https://..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>
              </div>
            </div>

            {/* Brand Accent Color */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Primary Brand Accent
              </label>
              <div className="flex items-center gap-3">
                {[
                  { color: '#301d6e', label: 'Eventory Indigo' },
                  { color: '#8ec82d', label: 'Eventory Lime' },
                  { color: '#e11d48', label: 'Rose Red' },
                  { color: '#2563eb', label: 'Royal Blue' },
                  { color: '#0f172a', label: 'Midnight Black' }
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setAccentColor(c.color)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('details')}
                className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Back to Details
              </button>

              <button
                type="button"
                onClick={handleProceedToTickets}
                className="px-8 py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Continue to Tickets
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TICKETS */}
        {currentStep === 'tickets' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Create Tickets
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Set up free RSVP tiers or paid tickets with instant gate check-in passes.
              </p>
            </div>

            {/* Existing Tiers List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Active Ticket Tiers ({ticketTiers.length})
              </h2>

              <div className="space-y-3">
                {ticketTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{tier.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#301d6e]">
                          {tier.price === 0 ? 'Free RSVP' : `₦${tier.price.toLocaleString()}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{tier.description}</p>
                      <span className="text-[11px] text-slate-400 font-semibold block pt-1">
                        Capacity: {tier.remaining} tickets
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveTier(tier.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Ticket Tier Card */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                + Add Another Ticket Tier
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tier Name *</label>
                  <input
                    type="text"
                    value={newTierName}
                    onChange={(e) => setNewTierName(e.target.value)}
                    placeholder="e.g. Early Bird, VVIP Table"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Price (₦, 0 for free) *</label>
                  <input
                    type="number"
                    min={0}
                    value={newTierPrice}
                    onChange={(e) => setNewTierPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Quantity Available *</label>
                  <input
                    type="number"
                    min={1}
                    value={newTierQty}
                    onChange={(e) => setNewTierQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Perks & Description</label>
                <input
                  type="text"
                  value={newTierDesc}
                  onChange={(e) => setNewTierDesc(e.target.value)}
                  placeholder="Includes cocktail reception, reserved parking, VIP badge..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <button
                type="button"
                onClick={handleAddTicketTier}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save This Tier</span>
              </button>
            </div>

            {/* Bottom Final Publish Actions */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('appearance')}
                className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Back to Appearance
              </button>

              <button
                type="button"
                onClick={handlePublishEvent}
                className="px-10 py-3.5 bg-[#8ec82d] hover:bg-[#76a824] text-[#1e1144] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Publish Event Now</span>
              </button>
            </div>

          </div>
        )}

      </main>

      </div>
    </DashboardLayout>
  );
}
