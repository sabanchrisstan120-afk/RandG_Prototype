import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface TechnicianHoldModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const COMMON_HOLD_REASONS = [
  'Awaiting parts delivery (capacitor/bearing/filter)',
  'Client requested temporary pause / stepped out',
  'Severe weather / rain preventing outdoor condenser work',
  'Building management work permit expired for today',
  'Specialized equipment required from central depot'
];

export const TechnicianHoldModal: React.FC<TechnicianHoldModalProps> = ({
  jobId,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason.trim() || 'Awaiting customer or technical parts follow-up');
    setReason('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pause Job / Put On Hold"
      subtitle={`Job ${jobId} - Provide a brief explanation for dispatch`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Reason for pausing work <span className="text-slate-400 font-normal">(Brief description)</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Awaiting delivery of 35uF dual capacitor from main office..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
          />

          {/* Quick preset chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_HOLD_REASONS.map((r, idx) => (
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
            className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Confirm Put On Hold
          </button>
        </div>
      </form>
    </Modal>
  );
};
