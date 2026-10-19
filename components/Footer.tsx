'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-slate-100">
          
          {/* Left Column: Brand & Newsletter (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-2xl font-black text-[#301d6e] tracking-tight">
                eventory
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#8ec82d] inline-block mb-1"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                NEXUS
              </span>
            </Link>

            <p className="text-slate-500 max-w-sm text-xs leading-relaxed">
              Sign up to our newsletter to receive information about upcoming live events, summits, festivals, and verified venue openings in Nigeria.
            </p>

            {/* Newsletter Form (Tix.africa style) */}
            <form onSubmit={handleSubscribe} className="flex max-w-md items-center gap-2 pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#301d6e]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Right Columns: Company & Follow Us (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Company</h4>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/" className="hover:text-slate-900">Homepage</Link></li>
                <li><Link href="/events" className="hover:text-slate-900">Discover Events</Link></li>
                <li><Link href="/marketplace" className="hover:text-slate-900">Marketplace</Link></li>
                <li><Link href="/login" className="hover:text-slate-900">Sign In</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Pilot Hubs</h4>
              <ul className="space-y-2 text-slate-500">
                <li><span>Abuja (FCT Pilot)</span></li>
                <li><span>Lagos Hub</span></li>
                <li><span>Port Harcourt</span></li>
                <li><span>West Africa Expansion</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Follow Us</h4>
              <ul className="space-y-2 text-slate-500">
                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">X (Twitter)</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">Instagram</a></li>
                <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">Facebook</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">LinkedIn</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Legal Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            Copyright © 2027. Eventory Nexus Limited. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-600">Terms & Conditions</Link>
            <Link href="/" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-600">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
