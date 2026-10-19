'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, QrCode, CheckCircle2, AlertTriangle, XCircle, Search, 
  RefreshCw, Smartphone, Users, Camera, Zap, ShieldCheck, Check 
} from 'lucide-react';
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
    message: 'Point camera at attendee digital pass or enter ticket reference.'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    async function startCamera() {
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode }
          });
          if (isMounted && videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
            setCameraError(null);
          }
        } else {
          if (isMounted) {
            setCameraActive(false);
            setCameraError('Camera API not supported on this browser.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setCameraActive(false);
          setCameraError('Camera access not granted or unavailable.');
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleScanSubmit = (codeToVerify?: string) => {
    const code = (codeToVerify || inputCode).trim().toUpperCase();
    if (!code) return;

    const res = onCheckInGuest(code);
    if (res.success) {
      setScanResult({
        status: 'success',
        message: `VALID PASS • Welcome ${res.guest?.name}!`,
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
        message: `INVALID PASS • Reference "${code}" not found in event registry.`
      });
    }
  };

  const checkedInCount = guests.filter((g) => g.checkedIn).length;
  const totalCount = guests.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Top Header (Clean White & Brand Deep Purple) */}
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#301d6e] flex items-center justify-center text-white shadow-xs">
              <Camera className="w-4 h-4 text-[#8ec82d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-tight text-slate-900">
                  EVENTORY GATE SCANNER
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] bg-[#8ec82d]/20 text-[#28500c] font-black px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8ec82d] animate-ping inline-block"></span>
                  LIVE GATE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">On-Site Gate Pass & Cryptographic QR Verification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close scanner"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Gate Metrics Ticker (Brand Deep Purple, NO grey) */}
        <div className="bg-[#301d6e] text-white px-5 py-2.5 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-purple-100">
            <Users className="w-3.5 h-3.5 text-[#8ec82d]" />
            <span>Checked-In:</span>
            <strong className="text-white font-bold">{checkedInCount} / {totalCount}</strong>
          </div>
          <div className="text-[11px] text-[#8ec82d] font-black bg-white/10 px-2 py-0.5 rounded">
            {Math.round((checkedInCount / (totalCount || 1)) * 100)}% Admitted
          </div>
        </div>

        {/* Camera Viewport Area */}
        <div className="p-5 sm:p-6 flex flex-col items-center bg-white">
          <div className="relative w-full max-w-xs h-64 sm:h-72 rounded-2xl bg-black overflow-hidden shadow-lg border-2 border-slate-900 flex items-center justify-center">
            
            {/* Live Camera Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Fallback Viewport Graphic if camera unavailable */}
            {!cameraActive && (
              <div className="absolute inset-0 bg-[#0f0a21] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/10">
                  <QrCode className="w-8 h-8 text-[#8ec82d] animate-pulse" />
                </div>
                <p className="text-xs font-bold text-white">Camera Viewfinder</p>
                <p className="text-[10px] text-purple-200 mt-0.5 max-w-[200px]">
                  {cameraError || 'Align attendee digital pass inside frame'}
                </p>
              </div>
            )}

            {/* 4 Sharp Neon Lime Targeting Reticles (Solid, sharp corner brackets) */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-[#8ec82d] rounded-tl-sm pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-[#8ec82d] rounded-tr-sm pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-[#8ec82d] rounded-bl-sm pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-[#8ec82d] rounded-br-sm pointer-events-none"></div>

            {/* Scanning Laser Beam */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#8ec82d] to-transparent shadow-[0_0_16px_#8ec82d] animate-pulse pointer-events-none"></div>

            {/* Controls overlay in viewfinder */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-2 text-white">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#8ec82d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ec82d] animate-ping"></span>
                {cameraActive ? 'Camera Live' : 'Simulation Mode'}
              </span>

              <button
                type="button"
                onClick={toggleCameraFacing}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all cursor-pointer"
                title="Flip Camera"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Validation Status Feedback Banner */}
          <div className="w-full mt-4">
            {scanResult.status === 'idle' && (
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-center text-xs text-slate-600 font-medium">
                Ready to scan attendee QR pass or enter ticket code.
              </div>
            )}

            {scanResult.status === 'success' && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.guest && (
                  <div className="mt-2 pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-900 grid grid-cols-2 gap-2 font-medium">
                    <div>Tier: <strong className="font-bold">{scanResult.guest.ticketType}</strong></div>
                    <div>Seat: <strong className="font-bold">{scanResult.guest.tableNumber || 'General Admission'}</strong></div>
                    <div>Ref: <strong className="font-mono">{scanResult.guest.ticketCode}</strong></div>
                    <div>Status: <strong className="text-emerald-700 font-black">ADMITTED ✓</strong></div>
                  </div>
                )}
              </div>
            )}

            {scanResult.status === 'warning' && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-800 font-black text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.guest && (
                  <p className="text-[11px] text-amber-700 mt-1 font-medium">
                    Duplicate entry attempt flagged on Eventory security registry.
                  </p>
                )}
              </div>
            )}

            {scanResult.status === 'error' && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-rose-800 font-black text-xs">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{scanResult.message}</span>
                </div>
                <p className="text-[11px] text-rose-700 mt-1 font-medium">
                  Please verify attendee booking or escort to Eventory Help Desk.
                </p>
              </div>
            )}
          </div>

          {/* Manual Ticket Code Entry */}
          <div className="w-full mt-4">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Manual Reference Entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. EVT-STW-003"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#301d6e] focus:border-[#301d6e]"
              />
              <button
                type="button"
                onClick={() => handleScanSubmit()}
                className="px-4 py-2.5 bg-[#301d6e] hover:bg-[#20134e] text-white font-black text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Verify & Admit
              </button>
            </div>
          </div>

          {/* Quick Demo Test Buttons */}
          <div className="w-full mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-1.5">
              Quick Test Simulation:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => { setInputCode('EVT-STW-003'); handleScanSubmit('EVT-STW-003'); }}
                className="text-[10px] font-mono bg-purple-50 hover:bg-[#301d6e] hover:text-white px-2.5 py-1 rounded-lg text-[#301d6e] border border-purple-200/80 transition-colors cursor-pointer"
              >
                EVT-STW-003 (Unchecked)
              </button>
              <button
                type="button"
                onClick={() => { setInputCode('EVT-STW-001'); handleScanSubmit('EVT-STW-001'); }}
                className="text-[10px] font-mono bg-purple-50 hover:bg-[#301d6e] hover:text-white px-2.5 py-1 rounded-lg text-[#301d6e] border border-purple-200/80 transition-colors cursor-pointer"
              >
                EVT-STW-001 (Already In)
              </button>
              <button
                type="button"
                onClick={() => { setInputCode('EVT-STW-004'); handleScanSubmit('EVT-STW-004'); }}
                className="text-[10px] font-mono bg-purple-50 hover:bg-[#301d6e] hover:text-white px-2.5 py-1 rounded-lg text-[#301d6e] border border-purple-200/80 transition-colors cursor-pointer"
              >
                EVT-STW-004 (Senator Bello)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 font-medium">
          Eventory Scan Engine • Cryptographic Verification • Offline Sync Ready
        </div>

      </div>
    </div>
  );
}
