'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../context/EventoryContext';
import { User, Building2, Mail, Phone, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function DashboardAccountPage() {
  const { currentUser, setCurrentUser, showToast } = useEventory();
  const [name, setName] = useState(currentUser.name || 'Ezekiel Adeleke');
  const [orgName, setOrgName] = useState(currentUser.organizationName || 'Eventory Nexus Limited');
  const [email, setEmail] = useState(currentUser.email || 'ezekiel@eventory.nexus');
  const [phone, setPhone] = useState(currentUser.phone || '+234 803 123 4567');
  const [bankName, setBankName] = useState('Zenith Bank');
  const [accountNumber, setAccountNumber] = useState('1012345678');
  const [accountName, setAccountName] = useState('Eventory Nexus Ltd');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name,
      organizationName: orgName,
      email,
      phone
    }));
    showToast('✓ Organiser profile & payout details saved!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Organiser Profile & Payouts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your public brand persona and Nigerian bank account for automated ticket proceeds payout.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Brand Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Host Identity
            </h3>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Organization / Brand Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Phone (WhatsApp enabled)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>
            </div>
          </div>

          {/* Bank Payout Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Payout Settlement Account (Nigeria)
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NIBSS Verified
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Account Number (NUBAN)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Save Profile & Payout Settings
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
