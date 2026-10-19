'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, Tag, Megaphone, QrCode, User, 
  HelpCircle, LogOut, Store, X, Send, Briefcase
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function DashboardSidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const isVendorRoute = pathname.startsWith('/dashboard/vendor');

  const creatorNavLinks = [
    { href: '/dashboard/events', label: 'Events Studio', icon: Calendar },
    { href: '/dashboard/discounts', label: 'Discounts', icon: Tag },
    { href: '/dashboard/marketing', label: 'Marketing', icon: Megaphone },
    { href: '/dashboard/box-office', label: 'Box office', icon: QrCode },
    { href: '/dashboard/account', label: 'Account & Payouts', icon: User },
  ];

  const vendorNavLinks = [
    { href: '/dashboard/vendor', label: 'Vendor Overview', icon: Store },
    { href: '/dashboard/vendor/enquiries', label: 'Client Inquiries', icon: Send },
    { href: '/dashboard/vendor/bookings', label: 'Confirmed Bookings', icon: Calendar },
    { href: '/dashboard/vendor/packages', label: 'Packages & Rates', icon: Briefcase },
    { href: '/dashboard/account', label: 'Payout & Profile', icon: User },
  ];

  const activeLinks = isVendorRoute ? vendorNavLinks : creatorNavLinks;

  const isActive = (href: string) => {
    if (href === '/dashboard/events') {
      return pathname === '/dashboard/events' || pathname.startsWith('/dashboard/events/');
    }
    if (href === '/dashboard/vendor') {
      return pathname === '/dashboard/vendor';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col justify-between z-50 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Top Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100/60">
            <Link href="/" className="flex items-center gap-1.5 group">
              <span className="text-xl font-black tracking-tight text-[#301d6e]">
                eventory
              </span>
              <span className="w-2 h-2 rounded-full bg-[#8ec82d] inline-block mb-1"></span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                {isVendorRoute ? 'VENDOR' : 'STUDIO'}
              </span>
            </Link>

            {onCloseMobile && (
              <button 
                onClick={onCloseMobile} 
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Clean Navigation Links (No role switcher tabs) */}
          <nav className="px-3 space-y-1.5 mt-5">
            {activeLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                    active
                      ? 'text-[#301d6e] bg-purple-50/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {/* Left Active Indicator Bar */}
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#301d6e] rounded-r-full"></span>
                  )}
                  <Icon className={`w-4 h-4 ${active ? 'text-[#301d6e]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Sidebar Items */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign out</span>
          </Link>
        </div>

      </aside>
    </>
  );
}
