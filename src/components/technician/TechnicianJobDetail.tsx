import React from 'react';
import type { ServiceJob } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Navigation, 
  Wind, 
  AlertTriangle, 
  Play, 
  Pause, 
  CheckCircle
} from 'lucide-react';

interface TechnicianJobDetailProps {
  job: ServiceJob;
  onBack: () => void;
  onStartJob: (jobId: string) => void;
  onOpenHoldModal: (jobId: string) => void;
  onResumeJob: (jobId: string) => void;
  onOpenCompleteModal: (job: ServiceJob) => void;
}

export const TechnicianJobDetail: React.FC<TechnicianJobDetailProps> = ({
  job,
  onBack,
  onStartJob,
  onOpenHoldModal,
  onResumeJob,
  onOpenCompleteModal
}) => {
  const isAssigned = job.status === 'Assigned';
  const isInProgress = job.status === 'In Progress';
  const isOnHold = job.status === 'On Hold';
  const isCompleted = job.status === 'Completed';

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    job.customerAddress + ', Metro Manila, Philippines'
  )}`;

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0A2342] p-2 rounded-xl bg-white border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Jobs</span>
        </button>

        <StatusBadge status={job.status} size="md" />
      </div>

      {/* Main Order Header Card */}
      <div className="bg-[#0A2342] text-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-extrabold text-[#2EC4B6] bg-navy-900/80 px-2.5 py-1 rounded-lg border border-[#2EC4B6]/30">
            {job.id}
          </span>
          <span className="text-xs bg-white/10 text-white font-semibold px-2.5 py-1 rounded-full">
            {job.serviceType}
          </span>
        </div>

        <h1 className="text-lg font-bold text-white mt-3">
          {job.customerName}
        </h1>

        <div className="mt-1 text-xs text-slate-300">
          Scheduled for: {job.preferredDate || 'Today'}
        </div>
      </div>

      {/* Card 1: Customer & Direct Contact */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Customer & Location
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {job.customerName}
          </h2>

          {/* Quick Call Action Button */}
          <div className="mt-2.5 flex items-center gap-2">
            <a
              href={`tel:${job.customerContact}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors shadow-2xs"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Client: {job.customerContact}</span>
            </a>
          </div>

          {/* Address with Map Link */}
          <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="leading-snug">{job.customerAddress}</p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
              >
                <Navigation className="w-3 h-3" />
                <span>Open in Google Maps Navigation</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Aircon Unit Specs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-[#2EC4B6]" />
          <span>Aircon Unit Details</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Brand & Type</span>
            <span className="font-bold text-slate-800">{job.aircon.brand} • {job.aircon.type}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Horsepower / Capacity</span>
            <span className="font-bold text-slate-800">{job.aircon.capacityHp || 'Standard Spec'}</span>
          </div>
        </div>

        {job.aircon.details && (
          <div className="text-xs text-slate-600 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-500">Unit Location / Details: </span>
            {job.aircon.details}
          </div>
        )}
      </div>

      {/* Card 3: Complaint & Admin Instructions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Customer Complaint</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-slate-800 italic leading-relaxed">
          "{job.complaint}"
        </div>

        {job.adminRemarks && (
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-slate-800 space-y-1">
            <span className="font-bold text-blue-900 block text-[11px] uppercase tracking-wider">
              Admin Instructions:
            </span>
            <p className="leading-relaxed">{job.adminRemarks}</p>
          </div>
        )}
      </div>

      {/* If Completed: Show Submitted Report */}
      {isCompleted && job.completionReport && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs space-y-3 bg-emerald-50/20">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Service Completion Report Submitted</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-800">Work Performed:</span>
              <p className="mt-0.5 text-slate-700 leading-relaxed">
                {job.completionReport.workPerformed}
              </p>
            </div>

            {job.completionReport.findingsAndRecommendations && (
              <div>
                <span className="font-bold text-slate-800">Findings & Recommendations:</span>
                <p className="mt-0.5 text-slate-700 leading-relaxed">
                  {job.completionReport.findingsAndRecommendations}
                </p>
              </div>
            )}

            {job.completionReport.photos.length > 0 && (
              <div className="pt-2">
                <span className="font-bold text-slate-800 block mb-1.5">
                  Uploaded Photos ({job.completionReport.photos.length}):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {job.completionReport.photos.map((p) => (
                    <div key={p.id} className="rounded-lg overflow-hidden border border-slate-200">
                      <img src={p.url} alt={p.caption} className="w-full h-24 object-cover" />
                      <div className="p-1 bg-white text-[10px] text-slate-600 truncate">
                        <span className="font-bold uppercase text-[9px] mr-1 text-emerald-700">[{p.type}]</span>
                        {p.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Status Action Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-30">
        <div className="max-w-xl mx-auto flex items-center gap-2.5">
          {/* Action 1: Start Job (Assigned -> In Progress) */}
          {isAssigned && (
            <button
              type="button"
              onClick={() => onStartJob(job.id)}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Job (Begin On-Site Work)</span>
            </button>
          )}

          {/* Action 2: When In Progress (Put On Hold or Complete Job) */}
          {isInProgress && (
            <>
              <button
                type="button"
                onClick={() => onOpenHoldModal(job.id)}
                className="w-1/3 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Pause className="w-4 h-4 text-orange-600" />
                <span>Put On Hold</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCompleteModal(job)}
                className="w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Complete Job & Report</span>
              </button>
            </>
          )}

          {/* Action 3: When On Hold (Resume Job) */}
          {isOnHold && (
            <button
              type="button"
              onClick={() => onResumeJob(job.id)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0A2342] hover:bg-[#12335C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Play className="w-5 h-5 fill-current text-[#2EC4B6]" />
              <span>Resume Job (Back In Progress)</span>
            </button>
          )}

          {/* Completed state indicator */}
          {isCompleted && (
            <div className="w-full py-2.5 text-center text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Job Completed & Report Submitted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
