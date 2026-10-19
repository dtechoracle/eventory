'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, User, Building2, Store, Sparkles } from 'lucide-react';
import { useEventory } from '../../context/EventoryContext';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useEventory();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'attendee' | 'organiser' | 'vendor'>('organiser');
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
      const appRole = role === 'organiser' ? 'creator' : role === 'vendor' ? 'vendor' : 'attendee';
      setCurrentUser({
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: fullName,
        email,
        phone,
        role: appRole,
        organizationName: `${fullName}'s Organization`
      });
      showToast(`Welcome to Eventory, ${fullName}!`);

      if (appRole === 'creator') {
        router.push('/dashboard/events');
      } else if (appRole === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/tickets');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-sans">
      
      {/* LEFT COLUMN: Clean Register Form (Full 50% on Desktop, perfectly centered) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20">
        
        {/* Brand Logo */}
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 group">
            <span className="text-2xl font-black tracking-tight text-[#301d6e]">
              eventory
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#8ec82d] inline-block mb-1"></span>
          </Link>
        </div>

        {/* Form Body */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
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

      {/* RIGHT COLUMN: Full bleed cover image covering the entire section */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen bg-[#301d6e]">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85"
          alt="Community & Events"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0e42]/95 via-[#301d6e]/40 to-black/20 flex flex-col justify-end p-12 xl:p-16 text-white">
          <div className="max-w-lg space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-[#8ec82d] border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#8ec82d]" />
              Eventory Community
            </span>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
              Start your journey
            </h2>
            <p className="text-sm xl:text-base text-purple-100 font-medium leading-relaxed">
              Host unforgettable experiences, issue digital QR passes, and book verified vendors across Nigeria.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-purple-200">
              <ShieldCheck className="w-4 h-4 text-[#8ec82d]" />
              <span>Trusted by thousands of event attendees and hosts across Nigeria</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
