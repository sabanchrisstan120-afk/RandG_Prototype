import React, { useState } from 'react';
import type { ServiceJob, ServicePhoto } from '../../types';
import { Modal } from '../common/Modal';
import { 
  QUICK_WORK_PERFORMED_TEMPLATES, 
  QUICK_FINDINGS_TEMPLATES, 
  SAMPLE_SERVICE_PHOTOS 
} from '../../data/mockData';
import { 
  CheckCircle2, 
  Upload, 
  X, 
  AlertCircle
} from 'lucide-react';

interface CompletionReportModalProps {
  job: ServiceJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobId: string, reportData: {
    workPerformed: string;
    findingsAndRecommendations?: string;
    photos: ServicePhoto[];
    confirmationChecked: boolean;
  }) => void;
}

export const CompletionReportModal: React.FC<CompletionReportModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [workPerformed, setWorkPerformed] = useState('');
  const [findings, setFindings] = useState('');
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (job) {
      setWorkPerformed('');
      setFindings('');
      setPhotos([]);
      setConfirmed(false);
      setErrorMsg('');
    }
  }, [job]);

  if (!job) return null;

  // Handle actual file upload (JPG, PNG, WEBP)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const newPhoto: ServicePhoto = {
            id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            url: result,
            type: photos.length === 0 ? 'before' : 'after', // auto-alternate or default
            caption: file.name.replace(/\.[^/.]+$/, ''),
            uploadedAt: new Date().toISOString()
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Quick preset sample photo picker (for easy testing without manual files)
  const handleAddSamplePhoto = (url: string, type: 'before' | 'after', caption: string) => {
    const newPhoto: ServicePhoto = {
      id: 'sample-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      url,
      type,
      caption,
      uploadedAt: new Date().toISOString()
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleTogglePhotoType = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const nextType = p.type === 'before' ? 'after' : p.type === 'after' ? 'general' : 'before';
          return { ...p, type: nextType };
        }
        return p;
      })
    );
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workPerformed.trim()) {
      setErrorMsg('Please describe the work performed on-site.');
      return;
    }
    if (!confirmed) {
      setErrorMsg('Please check the confirmation box before submitting.');
      return;
    }

    onSubmit(job.id, {
      workPerformed: workPerformed.trim(),
      findingsAndRecommendations: findings.trim() || undefined,
      photos,
      confirmationChecked: confirmed
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Service Job"
      subtitle={`Quick Completion Report for Job ${job.id} • ${job.customerName}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Work Performed */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Work Performed <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Minimal typing required</span>
          </div>
          <textarea
            rows={3}
            required
            value={workPerformed}
            onChange={(e) => {
              setWorkPerformed(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Describe the repair, cleaning, parts replaced, or installation work completed..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
          />

          {/* Quick preset chips for rapid technician entry */}
          <div className="mt-2 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold block">
              Tap a quick template to auto-fill:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_WORK_PERFORMED_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setWorkPerformed(tmpl)}
                  className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-slate-700 px-2 py-1 rounded-lg transition-colors text-left"
                >
                  + {tmpl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Findings / Recommendations */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            2. Findings & Recommendations <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            placeholder="e.g. Unit operating temperature normal (11.5°C). Advised customer on routine cleaning in 4 months..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
          />

          {/* Quick preset chips */}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {QUICK_FINDINGS_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFindings(tmpl)}
                className="text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-700 px-2 py-0.5 rounded-md transition-colors text-left"
              >
                + {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Upload Service Photos */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Service Photos ({photos.length} Attached)
            </label>
            <span className="text-[11px] text-slate-400">
              Before & After photo documentation
            </span>
          </div>

          {/* Upload Input & Sample Quick Pickers */}
          <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs">
                <Upload className="w-4 h-4 text-[#2EC4B6]" />
                <span>Upload From Device (JPG, PNG, WEBP)</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-[11px] text-slate-400 hidden sm:inline">or tap demo sample:</span>
            </div>

            {/* Quick Demo Sample Photo Buttons for Testing */}
            <div className="pt-2 border-t border-slate-200/70">
              <span className="text-[10px] text-slate-500 font-semibold block mb-1.5">
                Quick-add sample service photos for demonstration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddSamplePhoto(SAMPLE_SERVICE_PHOTOS.dirtyCoil, 'before', 'Clogged indoor evaporator fins before cleaning')}
                  className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-md transition-colors"
                >
                  + [Before] Dirty Evaporator Coil
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSamplePhoto(SAMPLE_SERVICE_PHOTOS.cleanedCoil, 'after', 'Sanitized aluminum fins after pressurized hydro-wash')}
                  className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md transition-colors"
                >
                  + [After] Clean Sanitized Unit
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSamplePhoto(SAMPLE_SERVICE_PHOTOS.capacitorTesting, 'before', 'Faulty 35uF capacitor testing on clamp meter')}
                  className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-md transition-colors"
                >
                  + [Before] Defective Capacitor
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSamplePhoto(SAMPLE_SERVICE_PHOTOS.gaugeCheck, 'after', 'Suction manifold gauge reading stable 125 PSI')}
                  className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md transition-colors"
                >
                  + [After] Pressure Gauge Verified
                </button>
              </div>
            </div>

            {/* Photos Preview Strip */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative rounded-xl border border-slate-200 bg-white overflow-hidden p-1.5 shadow-2xs group"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    
                    {/* Tag Badge (clickable to toggle before/after) */}
                    <div className="mt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleTogglePhotoType(photo.id)}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider transition-colors ${
                          photo.type === 'before'
                            ? 'bg-amber-100 text-amber-800'
                            : photo.type === 'after'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        title="Click to toggle Before / After tag"
                      >
                        {photo.type} ⇄
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Completion Confirmation */}
        <div className="p-3 bg-teal-50/50 border border-teal-200/80 rounded-xl">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                if (errorMsg) setErrorMsg('');
              }}
              className="mt-0.5 w-4 h-4 text-[#2EC4B6] rounded border-slate-300 focus:ring-[#2EC4B6]"
            />
            <span className="text-xs font-semibold text-slate-800 leading-snug">
              I confirm that all service work, testing, and clean-up have been completed on-site in accordance with R&G Aircon technical standards.
            </span>
          </label>
        </div>

        {/* 5. Submit Report */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0A2342] hover:bg-[#12335C] rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2EC4B6]" />
            <span>Submit Completion Report</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
