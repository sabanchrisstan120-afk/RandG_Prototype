import React, { useState } from 'react';
import type { ServiceJob, ServicePhoto } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { 
  User, 
  MapPin, 
  Phone, 
  Wind, 
  Clock, 
  ArrowRightLeft, 
  Camera, 
  FileText, 
  AlertTriangle,
  X
} from 'lucide-react';

interface JobDetailModalProps {
  job: ServiceJob | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReassign?: (job: ServiceJob) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onOpenReassign
}) => {
  const [activePhoto, setActivePhoto] = useState<ServicePhoto | null>(null);

  if (!job) return null;

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoStr;
    }
  };

  const hasReassignments = job.reassignments && job.reassignments.length > 0;
  const isCompleted = job.status === 'Completed';
  const completionReport = job.completionReport;

  // Separate before and after photos if available
  const beforePhotos = completionReport?.photos.filter((p) => p.type === 'before') || [];
  const afterPhotos = completionReport?.photos.filter((p) => p.type === 'after') || [];
  const generalPhotos = completionReport?.photos.filter((p) => p.type !== 'before' && p.type !== 'after') || [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="4xl"
      >
        <div className="space-y-6">
          {/* Top Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-extrabold text-[#0A2342] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  {job.id}
                </span>
                <StatusBadge status={job.status} size="lg" />
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {job.serviceType}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Service Order Details: {job.customerName}
              </h2>
            </div>

            {/* Quick Reassign Action */}
            {onOpenReassign && !['Completed', 'Cancelled'].includes(job.status) && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReassign(job);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0A2342] bg-teal-50 hover:bg-teal-100 border border-[#2EC4B6]/40 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#2EC4B6]" />
                <span>Reassign Technician</span>
              </button>
            )}
          </div>

          {/* Grid: Customer & Aircon Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0A2342]" />
                <span>Customer Information</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{job.customerName}</p>
                <div className="mt-1.5 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${job.customerContact}`} className="text-blue-600 hover:underline font-mono">
                      {job.customerContact}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{job.customerAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aircon Unit Details */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#2EC4B6]" />
                <span>Aircon Unit Specifications</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Brand & System:</span>
                  <span className="font-semibold text-slate-800">{job.aircon.brand} • {job.aircon.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Horsepower / Capacity:</span>
                  <span className="font-semibold text-slate-800">{job.aircon.capacityHp || 'Standard'}</span>
                </div>
                {job.aircon.details && (
                  <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-200/60">
                    <span className="font-medium text-slate-500">Location / Specs: </span>
                    {job.aircon.details}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison: Customer Complaint vs Technician's Actual Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Complaint */}
            <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Original Customer Complaint</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{job.complaint}"
              </p>
              {job.adminRemarks && (
                <div className="mt-3 pt-2.5 border-t border-amber-200/70 text-xs text-slate-700">
                  <span className="font-bold text-amber-900">Admin Instructions: </span>
                  {job.adminRemarks}
                </div>
              )}
            </div>

            {/* Technician Actual Findings / Work */}
            <div className={`border rounded-xl p-4 ${
              isCompleted 
                ? 'border-emerald-200 bg-emerald-50/30' 
                : 'border-slate-200 bg-slate-50/50'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2 text-slate-800">
                <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Technician's Actual On-Site Findings</span>
              </div>
              {isCompleted && completionReport ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Work Performed:</span>
                    <p className="mt-0.5 text-slate-700 leading-relaxed">
                      {completionReport.workPerformed}
                    </p>
                  </div>
                  {completionReport.findingsAndRecommendations && (
                    <div className="pt-2 border-t border-emerald-200/60">
                      <span className="font-bold text-slate-800">Findings & Recommendations:</span>
                      <p className="mt-0.5 text-slate-700 leading-relaxed">
                        {completionReport.findingsAndRecommendations}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Work is currently {job.status.toLowerCase()}. Technician on-site diagnostic report will appear here upon completion.
                </p>
              )}
            </div>
          </div>

          {/* Technician Assignment & Historical Accountability */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Technician Assignment & Accountability
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-[11px] text-slate-500 block">Currently Assigned</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {job.assignedTechnicianName}
                </span>
                <span className="text-[10px] text-slate-400">
                  Assigned: {formatDate(job.assignedAt)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-[11px] text-slate-500 block">Originally Assigned</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {job.originalTechnicianName}
                </span>
                <span className="text-[10px] text-slate-400">
                  Initial Dispatch
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-[11px] text-slate-500 block">Completed By</span>
                <span className="font-bold text-emerald-800 text-sm mt-0.5 block">
                  {completionReport ? completionReport.completedByTechName : 'In Progress / Pending'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {completionReport ? `Signed: ${formatDate(completionReport.completedAt)}` : 'On-site execution'}
                </span>
              </div>
            </div>

            {/* Reassignment Audit History Table if applicable */}
            {hasReassignments && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Reassignment Log ({job.reassignments.length} changes recorded)
                </span>
                <div className="space-y-2">
                  {job.reassignments.map((r) => (
                    <div key={r.id} className="text-xs p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-medium text-slate-800">
                          <span className="font-bold text-slate-900">{r.fromTechnicianName}</span>
                          <span className="text-slate-500"> → Reassigned to </span>
                          <span className="font-bold text-blue-900">{r.toTechnicianName}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          <strong>Reason:</strong> {r.reason}
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-400 shrink-0 text-right">
                        <span>{formatDate(r.reassignedAt)}</span>
                        <div className="text-slate-500">By: {r.reassignedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Uploaded Photos Section (Before & After) */}
          {completionReport && completionReport.photos.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  <span>Service Completion Photos ({completionReport.photos.length})</span>
                </div>
                <span className="text-xs text-slate-500">
                  Click any photo to enlarge
                </span>
              </div>

              {/* Before and After side by side gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {beforePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhoto(photo)}
                    className="group relative rounded-xl border border-amber-200 bg-amber-50/30 overflow-hidden cursor-pointer shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                        BEFORE SERVICE
                      </span>
                    </div>
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Before work'}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="p-2 bg-white text-xs text-slate-700">
                      <p className="text-[11px] font-medium line-clamp-2">
                        {photo.caption || 'Initial condition before service'}
                      </p>
                    </div>
                  </div>
                ))}

                {afterPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhoto(photo)}
                    className="group relative rounded-xl border border-emerald-200 bg-emerald-50/30 overflow-hidden cursor-pointer shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                        AFTER SERVICE
                      </span>
                    </div>
                    <img
                      src={photo.url}
                      alt={photo.caption || 'After work'}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="p-2 bg-white text-xs text-slate-700">
                      <p className="text-[11px] font-medium line-clamp-2">
                        {photo.caption || 'Finished service condition'}
                      </p>
                    </div>
                  </div>
                ))}

                {generalPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhoto(photo)}
                    className="group relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden cursor-pointer shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                        SERVICE PHOTO
                      </span>
                    </div>
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Service photo'}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="p-2 bg-white text-xs text-slate-700">
                      <p className="text-[11px] font-medium line-clamp-2">
                        {photo.caption || 'On-site verification'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline History */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Status History & Audit Trail</span>
            </div>
            <div className="space-y-3">
              {job.statusHistory.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#2EC4B6] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.status}</span>
                      <span className="text-[10px] text-slate-400">{formatDate(log.timestamp)}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded font-medium">
                        By {log.updatedBy}
                      </span>
                    </div>
                    {log.remarks && (
                      <p className="text-slate-600 mt-0.5 text-[11px]">
                        {log.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close button */}
          <div className="flex items-center justify-end pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0A2342] hover:bg-[#12335C] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      </Modal>

      {/* Full Photo Preview Lightbox */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-3xl w-full text-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activePhoto.url}
              alt={activePhoto.caption}
              className="max-h-[80vh] w-auto mx-auto rounded-xl shadow-2xl object-contain"
            />
            <div className="mt-3 text-white text-sm font-semibold">
              <span className={`inline-block mr-2 px-2 py-0.5 rounded text-xs uppercase font-bold ${
                activePhoto.type === 'before' ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                {activePhoto.type}
              </span>
              {activePhoto.caption}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
