'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { useEventory } from '../../../../context/EventoryContext';
import { formatNaira } from '../../../../lib/utils';
import { Store, Plus, Check, Trash2, Edit3, ShieldCheck } from 'lucide-react';

export default function VendorPackagesPage() {
  const { vendors, showToast } = useEventory();
  const currentVendor = vendors[0];

  const [packages, setPackages] = useState(
    currentVendor.packages || [
      {
        id: 'pkg-1',
        name: 'Standard Gold Package',
        price: 850000,
        description: 'Comprehensive 3-course menu for up to 250 guests including dessert and drink service.',
        features: ['3-Course Buffet', 'Up to 250 Guests', 'Professional Waitstaff', 'Setup & Clean-up']
      },
      {
        id: 'pkg-2',
        name: 'Platinum Banquet Package',
        price: 1850000,
        description: 'Luxury multi-continental menu with live carving stations, mocktail bar, and VIP table service.',
        features: ['Multi-Continental Cuisine', 'Up to 500 Guests', 'Live Chef Carving Station', 'Signature Mocktail Bar', 'Dedicated VIP Host']
      }
    ]
  );

  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState<number>(0);
  const [newPkgDesc, setNewPkgDesc] = useState('');

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim() || newPkgPrice <= 0) return;
    setPackages([
      ...packages,
      {
        id: `pkg-${Date.now().toString().slice(-4)}`,
        name: newPkgName,
        price: Number(newPkgPrice),
        description: newPkgDesc || 'Custom tailored event service package.',
        features: ['Custom Menu Planning', 'Service Staff Included', 'Direct Escrow Guarantee']
      }
    ]);
    setNewPkgName('');
    setNewPkgPrice(0);
    setNewPkgDesc('');
    showToast(`✓ Package "${newPkgName}" added to your Marketplace profile!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Service Packages & Rates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure tiered offerings that clients can view and book directly on your Eventory Marketplace profile.
          </p>
        </div>

        {/* Existing Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-base text-slate-900">{pkg.name}</h3>
                  <strong className="text-base font-black text-[#301d6e]">
                    {formatNaira(pkg.price)}
                  </strong>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Deliverables Included:</span>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-[#8ec82d] stroke-[3]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  ● Published on Profile
                </span>
                <button
                  type="button"
                  onClick={() => setPackages(packages.filter((p) => p.id !== pkg.id))}
                  className="text-xs text-slate-400 hover:text-rose-600 p-1 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Package Form */}
        <form onSubmit={handleAddPackage} className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            + Create New Package Tier
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Package Name *</label>
              <input
                type="text"
                required
                value={newPkgName}
                onChange={(e) => setNewPkgName(e.target.value)}
                placeholder="e.g. VIP Reception Package"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Starting Price (₦) *</label>
              <input
                type="number"
                min={1000}
                required
                value={newPkgPrice}
                onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                placeholder="e.g. 500000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Scope Description</label>
            <textarea
              rows={2}
              value={newPkgDesc}
              onChange={(e) => setNewPkgDesc(e.target.value)}
              placeholder="Detailed deliverables, staff count, and equipment provided..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#301d6e]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Save Package to Marketplace
          </button>
        </form>

      </div>
    </DashboardLayout>
  );
}
