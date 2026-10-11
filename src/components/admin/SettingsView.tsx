import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RotateCcw, 
  Building2, 
  ShieldCheck, 
  Database,
  CheckCircle2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { resetAllData } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetAllData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          System Settings & Operations Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Service center contact details, dispatch parameters, prototype storage management, and demo datasets
        </p>
      </div>

      {/* Service Center Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-[#0A2342]" />
          <h2 className="text-sm font-bold text-slate-900">
            R&G Aircon Repair and Installation Service Center Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Company Registered Name</span>
            <p className="font-bold text-slate-900">R&G Air-Conditioning Services Co.</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Central Dispatch Hotline</span>
            <p className="font-mono text-slate-900 font-semibold">(02) 8652-9100 / 0917-800-COOL</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Service Hub & Depot Address</span>
            <p className="text-slate-800">142 Ortigas Avenue Ext., Brgy. Rosario, Pasig City, Metro Manila</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Operating Service Hours</span>
            <p className="text-slate-800">Monday to Saturday: 7:30 AM – 6:30 PM (Emergency on-call available)</p>
          </div>
        </div>
      </div>

      {/* Prototype Storage & Persistence Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Database className="w-4 h-4 text-[#2EC4B6]" />
          <h2 className="text-sm font-bold text-slate-900">
            Prototype Data Persistence Notice
          </h2>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            This interactive application prototype uses browser <strong>localStorage</strong> to persist service assignments, customer records, technician reassignments, and uploaded completion photos across page reloads.
          </p>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Architecture Note:</strong> The state management layer (<code className="bg-blue-100 px-1 py-0.5 rounded text-[10px]">AppContext.tsx</code>) is completely decoupled from the view layer, allowing straightforward drop-in integration with a REST/GraphQL API or PostgreSQL database when transitioning from prototype to production.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold text-rose-900">
            Reset Prototype Demo Data
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Restore the clean initial dataset containing sample customers (Juan Dela Cruz, Maria Clara Santos, David Lim), registered technicians (Mark Santos, Carlo Reyes, Michael Fernandez), and realistic service orders (Repair, Cleaning, Installation).
        </p>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demo dataset successfully restored to initial state!</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
