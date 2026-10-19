'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, User, Building2, Store } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'attendee' | 'organiser' | 'vendor'>('attendee');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      alert('Please fill in your name, email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'organiser') {
        router.push('/organiser');
      } else if (role === 'vendor') {
        router.push('/vendor');
      } else {
        router.push('/events');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* LEFT COLUMN: Clean Register Form (Matching media_1792159615213.png) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto lg:mx-0">
        
        {/* Brand Logo */}
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 group">
            <span className="text-2xl font-black tracking-tight text-[#301d6e]">
              eventory
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#8ec82d] inline-block mb-1"></span>
          </Link>
        </div>

        {/* Form Body */}
        <div className="my-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Create an account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Join Nigeria's unified event ecosystem
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                I want to:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRole('attendee')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    role === 'attendee'
                      ? 'border-[#301d6e] bg-[#301d6e]/5 font-bold text-[#301d6e]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Attend
                </button>
                <button
                  type="button"
                  onClick={() => setRole('organiser')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    role === 'organiser'
                      ? 'border-[#301d6e] bg-[#301d6e]/5 font-bold text-[#301d6e]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Organise
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    role === 'vendor'
                      ? 'border-[#301d6e] bg-[#301d6e]/5 font-bold text-[#301d6e]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Provide Service
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                * Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Stephen Adeleke"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] transition-all"
              />
            </div>

            {/* Email Address */}
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
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] transition-all"
              />
            </div>

            {/* Password */}
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
                  placeholder="Create a strong password"
                  className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] transition-all"
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

            {/* Cloudflare Verification Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#301d6e] border-t-transparent rounded-full animate-spin"></span>
                <span className="text-[11px] font-medium text-slate-600">Verifying secure connection...</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Cloudflare</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>

            {/* Helper Links */}
            <div className="pt-2 text-xs">
              <p className="text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-[#301d6e] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

          </form>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 pt-4">
          © 2027 Eventory Nexus Limited. Plan • Book • Experience.
        </div>

      </div>

      {/* RIGHT COLUMN: Stylish Illustration Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#fdf5f2] relative items-center justify-center p-12 overflow-hidden border-l border-slate-100">
        
        {/* Background Graphic Accents */}
        <div className="absolute top-12 right-12 w-64 h-64 bg-[#f8e6de] rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-12 left-12 w-80 h-80 bg-[#ebe4f8] rounded-full blur-3xl opacity-60"></div>

        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="w-72 h-80 sm:w-88 sm:h-96 mx-auto rounded-3xl overflow-hidden shadow-xl border border-white/60 relative">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80"
              alt="Community & Events"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#301d6e]/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8ec82d]">
                Eventory Community
              </span>
              <h3 className="text-lg font-black leading-snug">
                Start your journey
              </h3>
              <p className="text-xs text-purple-200 mt-0.5">
                Host unforgettable experiences, issue digital QR passes, and book verified vendors.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#8ec82d]" />
            <span>Trusted by thousands of event attendees across Nigeria</span>
          </div>
        </div>

      </div>

    </div>
  );
}
