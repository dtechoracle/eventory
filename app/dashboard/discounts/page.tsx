'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { Tag, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { useEventory } from '../../../context/EventoryContext';

export default function DashboardDiscountsPage() {
  const { showToast } = useEventory();
  const [coupons, setCoupons] = useState([
    { code: 'EARLYBIRD20', discount: '20% OFF', uses: '45 uses', status: 'Active' },
    { code: 'TECHCOMMUNITY', discount: '₦2,000 OFF', uses: '12 uses', status: 'Active' },
    { code: 'VIPGUEST', discount: '100% Complimentary', uses: '5 uses', status: 'Active' }
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCoupons([
      ...coupons,
      { code: newCode.toUpperCase(), discount: newDiscount || '15% OFF', uses: '0 uses', status: 'Active' }
    ]);
    setNewCode('');
    setNewDiscount('');
    showToast(`✓ Promo code ${newCode.toUpperCase()} created!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discount & Promo Codes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create promotional voucher codes for your attendees and partners.
          </p>
        </div>

        {/* Create Code Form */}
        <form onSubmit={handleCreateCoupon} className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
            + Create New Promo Code
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="e.g. SUMMIT2027"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
            />
            <input
              type="text"
              placeholder="e.g. 25% OFF or ₦5,000 OFF"
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Add Coupon
            </button>
          </div>
        </form>

        {/* Active Codes List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
          {coupons.map((c) => (
            <div key={c.code} className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-mono font-black text-sm text-[#301d6e] bg-purple-50 px-2.5 py-0.5 rounded-md">
                  {c.code}
                </span>
                <p className="text-xs text-slate-600 font-bold pt-1">{c.discount}</p>
                <span className="text-[11px] text-slate-400">{c.uses}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  ● {c.status}
                </span>
                <button
                  type="button"
                  onClick={() => setCoupons(coupons.filter((x) => x.code !== c.code))}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
