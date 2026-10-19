'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEventory } from '../../context/EventoryContext';
import { 
  Eye, EyeOff, ShieldCheck, ArrowRight, Calendar, 
  Store, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUserRole, showToast } = useEventory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAccess = (role: 'creator' | 'vendor' | 'attendee', targetPath: string, label: string) => {
    setCurrentUserRole(role);
    showToast(`✓ Accessing ${label}...`);
    router.push(targetPath);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Route based on role or to events dashboard by default
      setCurrentUserRole('creator');
      router.push('/dashboard/events');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-sans">
      
      {/* LEFT COLUMN: Portals & Clean Auth Form (Full 50% on Desktop, perfectly centered) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        
        {/* Brand Logo */}
        <div className="w-full max-w-lg mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 group">
            <span className="text-2xl font-black tracking-tight text-[#301d6e]">
              eventory
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#8ec82d] inline-block mb-1"></span>
          </Link>
        </div>

        {/* Portals & Form Body */}
        <div className="w-full max-w-lg mx-auto py-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In & Dashboard Portals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Choose your dashboard section below for instant access, or sign in with your credentials.
            </p>
          </div>

          {/* QUICK DASHBOARD ACCESS BUTTONS (Requested by user: 1-click access to all dashboard sections!) */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Direct Dashboard Access (All Sections)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Creator Dashboard */}
              <button
                type="button"
                onClick={() => handleQuickAccess('creator', '/dashboard/events', 'Event Creator Studio')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#301d6e] bg-slate-50/70 hover:bg-purple-50/40 text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#301d6e] text-white flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#8ec82d]" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#301d6e] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#301d6e] transition-colors">
                    Events Creator
                  </h4>
                  <span className="text-[10px] text-slate-500 block">
                    /dashboard/events
                  </span>
                </div>
              </button>

              {/* 2. Vendor Hub */}
              <button
                type="button"
                onClick={() => handleQuickAccess('vendor', '/dashboard/vendor', 'Vendor Hub')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#301d6e] bg-slate-50/70 hover:bg-purple-50/40 text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#301d6e] text-white flex items-center justify-center">
                    <Store className="w-4 h-4 text-[#8ec82d]" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#301d6e] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#301d6e] transition-colors">
                    Vendor Business Hub
                  </h4>
                  <span className="text-[10px] text-slate-500 block">
                    /dashboard/vendor
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold uppercase text-slate-400 shrink-0">
              Or sign in with email
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                * Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                * Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>

            <div className="pt-1 text-xs text-center text-slate-500">
              New to Eventory?{' '}
              <Link href="/signup" className="font-bold text-[#301d6e] hover:underline">
                Create an account
              </Link>
            </div>
          </form>

        </div>

        {/* Footer info */}
        <div className="w-full max-w-lg mx-auto text-[11px] text-slate-400 pt-3">
          © 2027 Eventory Nexus Limited. Plan • Book • Experience.
        </div>

      </div>

      {/* RIGHT COLUMN: Full bleed cover image covering the entire section */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen bg-[#301d6e]">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=85"
          alt="Event Attendees Experience"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0e42]/95 via-[#301d6e]/40 to-black/20 flex flex-col justify-end p-12 xl:p-16 text-white">
          <div className="max-w-lg space-y-4">
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
              One platform. Every event.
            </h2>
            <p className="text-sm xl:text-base text-purple-100 font-medium leading-relaxed">
              Connecting organizers, attendees, and trusted Nigerian service providers in one seamless ecosystem.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-purple-200">
              <ShieldCheck className="w-4 h-4 text-[#8ec82d]" />
              <span>Bank-grade encryption & milestone escrow protection</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
