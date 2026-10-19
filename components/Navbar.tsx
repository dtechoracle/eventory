'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, Store, Layers, Plus, Menu, X, 
  Search, User, ChevronDown 
} from 'lucide-react';

interface NavbarProps {
  onOpenGateScanner?: () => void;
  onOpenCreateEvent?: () => void;
}

export default function Navbar({ onOpenGateScanner, onOpenCreateEvent }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/events', label: 'Discover events' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/vendor', label: 'Vendors' }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Clean Tix-style typography with brand dot) */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-2xl font-black tracking-tight text-[#301d6e]">
              eventory
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#8ec82d] inline-block mb-1"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 hidden sm:inline">
              NEXUS
            </span>
          </Link>

          {/* Desktop Navigation Links (Centered, clean Poppins) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    active
                      ? 'text-[#301d6e] font-bold border-b-2 border-[#301d6e]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Search Link */}
            <Link
              href="/events"
              className="text-slate-500 hover:text-slate-800 p-2 transition-colors"
              title="Search events"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-[#301d6e] px-2 py-1"
            >
              Login
            </Link>

            {/* Create Event / Sign Up Button (Clean rounded pill) */}
            <Link
              href="/dashboard/events/create"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#301d6e] border border-[#301d6e] hover:bg-[#301d6e] hover:text-white transition-all duration-200"
            >
              Create an Event
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-5 space-y-4 shadow-sm">
          <nav className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-[#301d6e]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/dashboard/events/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full text-xs font-bold text-white bg-[#301d6e]"
            >
              Create an Event
            </Link>
            <Link
              href="/vendor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full text-xs font-bold text-[#301d6e] border border-slate-200"
            >
              Vendor Business Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
