'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEventory } from '../../context/EventoryContext';
import { 
  Eye, EyeOff, ShieldCheck, ArrowRight, Calendar, 
  Store, CheckCircle2, ChevronRight, AlertCircle, KeyRound 
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { setCurrentUser, showToast } = useEventory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setCurrentUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`);

        if (redirectUrl && redirectUrl.startsWith('/dashboard')) {
          router.push(redirectUrl);
        } else if (data.user.role === 'vendor') {
          router.push('/dashboard/vendor');
        } else {
          router.push('/dashboard/events');
        }
        return;
      }

      setErrorMessage(data.error || 'Invalid email or password.');
    } catch {
      setErrorMessage('Unable to connect to the authentication server. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sign In to Eventory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Access your event creator studio, vendor contracts, or ticket bookings.
        </p>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="font-semibold">{errorMessage}</div>
        </div>
      )}

      {/* Demo Credentials Quick Fill (Fills input fields for real authentication) */}
      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#301d6e]">
          <KeyRound className="w-4 h-4 text-[#8ec82d]" />
          <span>Need demo credentials? Fill fields below:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleFillDemo('creator@eventory.ng')}
            className="px-3 py-2 bg-white rounded-lg border border-purple-200 hover:border-[#301d6e] text-left transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-[11px] font-bold text-[#301d6e] block">Event Creator</span>
            <span className="text-[10px] text-slate-500 font-mono block">creator@eventory.ng</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('vendor@eventory.ng')}
            className="px-3 py-2 bg-white rounded-lg border border-purple-200 hover:border-[#301d6e] text-left transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-[11px] font-bold text-[#301d6e] block">Vendor Partner</span>
            <span className="text-[10px] text-slate-500 font-mono block">vendor@eventory.ng</span>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full py-3 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? 'Authenticating with Neon DB...' : 'Sign in to Dashboard'}
        </button>

        <div className="pt-1 text-xs text-center text-slate-500">
          New to Eventory?{' '}
          <Link href="/signup" className="font-bold text-[#301d6e] hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-sans">
      
      {/* LEFT COLUMN: Clean Auth Form (Full 50% on Desktop, perfectly centered) */}
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

        {/* Form Body wrapped in Suspense for useSearchParams */}
        <Suspense fallback={
          <div className="w-full max-w-lg mx-auto py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#301d6e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>

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
