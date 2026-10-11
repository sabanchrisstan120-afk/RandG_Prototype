import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ServiceJob } from '../../types';
import { Modal } from '../common/Modal';
import { UserCheck, ArrowRightLeft, AlertCircle } from 'lucide-react';

interface ReassignModalProps {
  job: ServiceJob | null;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_REASONS = [
  'Workload balancing across field teams',
  'Technician has specialized experience for this unit',
  'Customer requested specific service time slot',
  'Previous technician delayed on prior emergency call',
  'Route optimization for Pasig/QC service cluster'
];

export const ReassignModal: React.FC<ReassignModalProps> = ({ job, isOpen, onClose }) => {
  const { technicians, reassignTechnician } = useApp();
  const [selectedTechId, setSelectedTechId] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  React.useEffect(() => {
    if (job) {
      // Find another active technician by default
      const anotherTech = technicians.find((t) => t.id !== job.assignedTechnicianId && t.active);
      setSelectedTechId(anotherTech ? anotherTech.id : job.assignedTechnicianId);
      setReason('');
    }
  }, [job, technicians]);

  if (!job) return null;

  const currentTech = technicians.find((t) => t.id === job.assignedTechnicianId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechId || selectedTechId === job.assignedTechnicianId) {
      return;
    }
    reassignTechnician({
      jobId: job.id,
      newTechnicianId: selectedTechId,
      reason: reason.trim() || 'Workload balancing and schedule optimization'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reassign Technician"
      subtitle={`Change service technician for Job ${job.id} (${job.customerName})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current vs New Visual Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Current Assignment
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentTech?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                alt={job.assignedTechnicianName}
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-300"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {job.assignedTechnicianName}
                </div>
                <div className="text-xs text-slate-500">
                  Current Assigned Technician
                </div>
              </div>
            </div>
            <ArrowRightLeft className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="text-right">
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-100 text-blue-800">
                {job.status}
              </span>
            </div>
          </div>
        </div>

        {/* New Technician Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select New Technician <span className="text-rose-500">*</span>
          </label>
          <div className="space-y-2">
            {technicians.map((tech) => {
              const isCurrent = tech.id === job.assignedTechnicianId;
              const isSelected = selectedTechId === tech.id;

              return (
                <label
                  key={tech.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#2EC4B6] bg-teal-50/40 ring-1 ring-[#2EC4B6]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="newTechnician"
                      disabled={isCurrent || !tech.active}
                      checked={isSelected}
                      onChange={() => setSelectedTechId(tech.id)}
                      className="text-[#2EC4B6] focus:ring-[#2EC4B6]"
                    />
                    <img
                      src={tech.avatar}
                      alt={tech.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{tech.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-normal">
                            Currently Assigned
                          </span>
                        )}
                        {!tech.active && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-normal">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {tech.specialty} • {tech.contactNumber}
                      </div>
                    </div>
                  </div>
                  {isSelected && !isCurrent && (
                    <UserCheck className="w-4 h-4 text-[#2EC4B6] shrink-0" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Reason for Reassignment */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Reason for Reassignment <span className="text-slate-400 font-normal">(Recorded in assignment history)</span>
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Schedule conflict, client requested specialist..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
          />

          {/* Quick preset chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_REASONS.map((r, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReason(r)}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors text-left"
              >
                + {r}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Assignment History Notice:</strong> The original assignment ({job.assignedTechnicianName}) and this change will be permanently preserved in the service audit trail with timestamps.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedTechId || selectedTechId === job.assignedTechnicianId}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0A2342] hover:bg-[#12335C] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Confirm Reassignment
          </button>
        </div>
      </form>
    </Modal>
  );
};
