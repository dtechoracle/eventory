'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Tag, Plus, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
import { EventItem } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newEvent: EventItem) => void;
}

export default function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [category, setCategory] = useState<EventItem['category']>('Tech & Business');
  const [date, setDate] = useState('2027-11-20');
  const [time, setTime] = useState('10:00 AM WAT');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState<EventItem['city']>('Abuja');
  const [description, setDescription] = useState('');
  const [ticketName, setTicketName] = useState('General Admission');
  const [ticketPrice, setTicketPrice] = useState(10000);
  const [capacity, setCapacity] = useState(300);
  const [isFree, setIsFree] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !organizer) {
      alert('Please fill in the required event fields.');
      return;
    }

    const price = isFree ? 0 : ticketPrice;
    const newEvent: EventItem = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      organizer,
      organizerVerified: true,
      category,
      date,
      time,
      venue,
      city,
      state: city === 'Abuja' ? 'FCT' : city,
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
      description: description || 'Experience seamless ticketing and attendance managed with Eventory Nexus.',
      startingPrice: price,
      currency: 'NGN',
      ticketsSold: 0,
      capacity,
      ticketTiers: [
        {
          id: `tier-gen-${Date.now()}`,
          name: ticketName,
          price,
          description: isFree ? 'Complimentary Access' : 'Full access pass with digital QR verification.',
          remaining: capacity
        }
      ]
    };

    onEventCreated(newEvent);
    setIsDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#301d6e] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8ec82d]/20 text-[#8ec82d] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eventory Creator Studio</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Create a New Event
          </h3>
          <p className="text-xs text-purple-200 mt-1">
            Publish your event page, set ticket tiers in ₦ Naira, and initiate your dedicated Plan Workspace.
          </p>
        </div>

        {/* Content */}
        {!isDone ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. West Africa Green Energy Forum 2027"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organising Brand / Host *
                </label>
                <input
                  type="text"
                  required
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. GreenTech Consortium"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventItem['category'])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                >
                  <option value="Tech & Business">Tech & Business</option>
                  <option value="Conference">Conference</option>
                  <option value="Festival">Festival</option>
                  <option value="Music & Concert">Music & Concert</option>
                  <option value="Social & Wedding">Social & Wedding</option>
                  <option value="Workshops">Workshops</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM WAT"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Venue Name & Address *
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Transcorp Hilton Congress Hall, Maitama"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Host City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as EventItem['city'])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
                >
                  <option value="Abuja">Abuja (FCT)</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Online">Online / Hybrid</option>
                </select>
              </div>
            </div>

            {/* Ticket Tier Setup */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-800">Primary Ticket Tier</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#301d6e]">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="rounded text-[#301d6e] focus:ring-[#301d6e]"
                  />
                  <span>This is a Free RSVP Event</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tier Name</label>
                  <input
                    type="text"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Price (₦ NGN)</label>
                  <input
                    type="number"
                    disabled={isFree}
                    value={isFree ? 0 : ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Guest Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Highlights
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give attendees an exciting summary of the speakers, agenda, food or entertainment."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#301d6e]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-sm rounded-xl shadow-md shadow-[#301d6e]/20 transition-all flex items-center justify-center gap-2 border-b-2 border-[#8ec82d]"
            >
              <Plus className="w-4 h-4 text-[#8ec82d]" />
              <span>Publish Event to Eventory Ecosystem</span>
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#8ec82d]/20 text-[#557917] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#75a723]" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">
                Event Published Successfully!
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your event is now live on the <strong>Experience Discovery Feed</strong> and your dedicated <strong>Plan Workspace</strong> has been initialized.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl"
            >
              View in Eventory
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
