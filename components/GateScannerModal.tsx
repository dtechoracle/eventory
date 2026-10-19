'use client';

import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, AlertTriangle, XCircle, Search, RefreshCw, Smartphone, Users } from 'lucide-react';
import { WorkspaceGuest } from '../types';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: WorkspaceGuest[];
  onCheckInGuest: (code: string) => { success: boolean; message: string; guest?: WorkspaceGuest; alreadyCheckedIn?: boolean };
  initialCode?: string;
}

export default function GateScannerModal({
  isOpen,
  onClose,
  guests,
  onCheckInGuest,
  initialCode = ''
}: GateScannerModalProps) {
  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState(initialCode);
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error';
    message: string;
    guest?: WorkspaceGuest;
  }>({
    status: 'idle',
    message: 'Point camera at digital QR code or enter ticket reference below.'
  });

  const handleScanSubmit = (codeToVerify?: string) => {
    const code = (codeToVerify || inputCode).trim().toUpperCase();
    if (!code) return;

    const res = onCheckInGuest(code);
    if (res.success) {
      setScanResult({
        status: 'success',
        message: `VALID TICKET • Welcome ${res.guest?.name}!`,
        guest: res.guest
      });
    } else if (res.alreadyCheckedIn) {
      setScanResult({
        status: 'warning',
        message: `ALREADY SCANNED • ${res.guest?.name} checked in at ${res.guest?.checkInTime || 'earlier today'}.`,
        guest: res.guest
      });
    } else {
      setScanResult({
        status: 'error',
        message: `INVALID TICKET • Reference "${code}" not found in event registry.`
      });
    }
  };

  const checkedInCount = guests.filter((g) => g.checkedIn).length;
  const totalCount = guests.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#301d6e] flex items-center justify-center border border-[#8ec82d]">
              <QrCode className="w-4 h-4 text-[#8ec82d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-white">EVENTORY GATE SCANNER</span>
                <span className="text-[10px] bg-[#8ec82d]/20 text-[#8ec82d] font-bold px-1.5 py-0.5 rounded">
                  LIVE GATE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">On-Site Usher & Gate Control System</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Gate Metrics Ticker */}
        <div className="bg-[#301d6e]/40 border-b border-[#301d6e] px-4 py-2 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="w-3.5 h-3.5 text-[#8ec82d]" />
            <span>Checked-In:</span>
            <strong className="text-white font-bold">{checkedInCount} / {totalCount}</strong>
          </div>
          <div className="text-[11px] text-[#8ec82d] font-bold">
            {Math.round((checkedInCount / (totalCount || 1)) * 100)}% Admitted
          </div>
        </div>

        {/* Scanner Viewport Simulation */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-2xl bg-slate-950 border-2 border-dashed border-[#8ec82d]/60 flex items-center justify-center overflow-hidden shadow-inner">
            
            {/* Corner reticles */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#8ec82d]"></div>
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#8ec82d]"></div>
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#8ec82d]"></div>
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#8ec82d]"></div>

            {/* Scanning Laser Animation */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#8ec82d] to-transparent shadow-[0_0_12px_#8ec82d] animate-pulse"></div>

            {/* Scanner Center Graphic */}
            <div className="text-center p-4">
              <QrCode className="w-20 h-20 text-slate-700 mx-auto opacity-40 animate-pulse" />
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                Align ticket QR inside frame
              </p>
            </div>
          </div>

          {/* Validation Status Feedback Banner */}
          <div className="w-full mt-4">
            {scanResult.status === 'idle' && (
              <div className="p-3 bg-slate-800/80 rounded-xl text-center text-xs text-slate-400 border border-slate-700">
                Ready to scan attendee digital pass.
              </div>
            )}

            {scanResult.status === 'success' && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.guest && (
                  <div className="mt-2 pt-2 border-t border-emerald-800/50 text-[11px] text-emerald-200 grid grid-cols-2 gap-2">
                    <div>Tier: <strong>{scanResult.guest.ticketType}</strong></div>
                    <div>Seat: <strong>{scanResult.guest.tableNumber || 'General Admission'}</strong></div>
                    <div>Ref: <strong className="font-mono">{scanResult.guest.ticketCode}</strong></div>
                    <div>Admit: <strong className="text-emerald-300">CONFIRMED</strong></div>
                  </div>
                )}
              </div>
            )}

            {scanResult.status === 'warning' && (
              <div className="p-3.5 bg-amber-950/80 border border-amber-500/50 rounded-xl text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.guest && (
                  <p className="text-[11px] text-amber-300 mt-1">
                    Warning: Duplicate entry attempt flagged on Eventory server.
                  </p>
                )}
              </div>
            )}

            {scanResult.status === 'error' && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{scanResult.message}</span>
                </div>
                <p className="text-[11px] text-rose-300 mt-1">
                  Please verify attendee booking or escort to Eventory Help Desk.
                </p>
              </div>
            )}
          </div>

          {/* Manual Ticket Code Entry */}
          <div className="w-full mt-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Manual Code Entry / Barcode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. EVT-STW-003"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#8ec82d]"
              />
              <button
                type="button"
                onClick={() => handleScanSubmit()}
                className="px-4 py-2.5 bg-[#8ec82d] hover:bg-[#75a723] text-[#20134e] font-black text-xs rounded-xl transition-all"
              >
                Verify & Admit
              </button>
            </div>
          </div>

          {/* Quick Demo Test Buttons */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">
              Click to Test Simulation Code:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => { setInputCode('EVT-STW-003'); handleScanSubmit('EVT-STW-003'); }}
                className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 border border-slate-700"
              >
                EVT-STW-003 (Unchecked Guest)
              </button>
              <button
                type="button"
                onClick={() => { setInputCode('EVT-STW-001'); handleScanSubmit('EVT-STW-001'); }}
                className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 border border-slate-700"
              >
                EVT-STW-001 (Already In)
              </button>
              <button
                type="button"
                onClick={() => { setInputCode('EVT-STW-004'); handleScanSubmit('EVT-STW-004'); }}
                className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 border border-slate-700"
              >
                EVT-STW-004 (Senator Bello)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Eventory Scan Engine • End-to-End Cryptographic Ticket Verification • Offline Compatible
        </div>

      </div>
    </div>
  );
}
