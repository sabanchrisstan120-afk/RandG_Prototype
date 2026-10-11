import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Technician, ServiceJob } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Plus, 
  Phone, 
  Mail, 
  Edit, 
  Power,
  Briefcase
} from 'lucide-react';

interface TechnicianManagementProps {
  onViewJob: (job: ServiceJob) => void;
}

export const TechnicianManagement: React.FC<TechnicianManagementProps> = ({ onViewJob }) => {
  const { technicians, jobs, addTechnician, updateTechnician, toggleTechnicianActive } = useApp();

  const [selectedTechJobs, setSelectedTechJobs] = useState<Technician | null>(null);

  // Add / Edit Modal
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleOpenAdd = () => {
    setEditingTech(null);
    setName('');
    setContactNumber('');
    setSpecialty('Inverter Diagnostics & Circuit Board Repair');
    setEmail('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setTechModalOpen(true);
  };

  const handleOpenEdit = (tech: Technician) => {
    setEditingTech(tech);
    setName(tech.name);
    setContactNumber(tech.contactNumber);
    setSpecialty(tech.specialty);
    setEmail(tech.email || '');
    setAvatar(tech.avatar || '');
    setTechModalOpen(true);
  };

  const handleSaveTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactNumber.trim() || !specialty.trim()) return;

    if (editingTech) {
      updateTechnician({
        ...editingTech,
        name: name.trim(),
        contactNumber: contactNumber.trim(),
        specialty: specialty.trim(),
        email: email.trim() || undefined,
        avatar: avatar.trim() || editingTech.avatar
      });
    } else {
      addTechnician({
        name: name.trim(),
        contactNumber: contactNumber.trim(),
        specialty: specialty.trim(),
        email: email.trim() || undefined,
        active: true,
        avatar: avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: new Date().toISOString().split('T')[0]
      });
    }

    setTechModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Technician Roster & Field Staff
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage certified aircon technicians, account status, specialized skillsets, and workload assignments
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0A2342] hover:bg-[#12335C] text-white shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#2EC4B6]" />
          <span>Register New Technician</span>
        </button>
      </div>

      {/* Technician Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {technicians.map((tech) => {
          const techJobs = jobs.filter((j) => j.assignedTechnicianId === tech.id);
          const assignedCount = techJobs.filter((j) => j.status === 'Assigned').length;
          const inProgressCount = techJobs.filter((j) => j.status === 'In Progress').length;
          const completedCount = jobs.filter(
            (j) => j.completionReport?.completedByTechId === tech.id || 
                   (j.status === 'Completed' && j.assignedTechnicianId === tech.id)
          ).length;

          return (
            <div
              key={tech.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                tech.active ? 'border-slate-200/90' : 'border-slate-200 opacity-70 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tech.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                      alt={tech.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {tech.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {tech.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${tech.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={`text-[10px] font-bold ${tech.active ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {tech.active ? 'Active Field Staff' : 'Deactivated'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(tech)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit Technician Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Specialty Pill */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Field Specialty
                  </span>
                  <span className="font-semibold text-slate-800">
                    {tech.specialty}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{tech.contactNumber}</span>
                  </div>
                  {tech.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{tech.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Workload Matrix & Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                    <span className="text-[10px] text-blue-600 font-semibold block">Assigned</span>
                    <span className="text-sm font-black text-blue-900">{assignedCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                    <span className="text-[10px] text-amber-600 font-semibold block">In Progress</span>
                    <span className="text-sm font-black text-amber-900">{inProgressCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                    <span className="text-[10px] text-emerald-600 font-semibold block">Completed</span>
                    <span className="text-sm font-black text-emerald-900">{completedCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => toggleTechnicianActive(tech.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      tech.active
                        ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{tech.active ? 'Deactivate' : 'Activate'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTechJobs(tech)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0A2342] hover:bg-slate-100 transition-colors"
                  >
                    <Briefcase className="w-3 h-3 text-[#2EC4B6]" />
                    <span>View Jobs ({techJobs.length})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technician Jobs Detail Modal */}
      {selectedTechJobs && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTechJobs(null)}
          title={`Job History: ${selectedTechJobs.name}`}
          subtitle={`${selectedTechJobs.specialty} • ${selectedTechJobs.contactNumber}`}
          maxWidth="3xl"
        >
          {(() => {
            const techJobs = jobs.filter(
              (j) => j.assignedTechnicianId === selectedTechJobs.id || 
                     j.completionReport?.completedByTechId === selectedTechJobs.id
            );

            return (
              <div className="space-y-4">
                {techJobs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                    No active or completed jobs assigned to this technician.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Job ID</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {techJobs.map((j) => (
                          <tr key={j.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-3 font-mono font-bold text-[#0A2342]">
                              {j.id}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900">{j.customerName}</span>
                              <div className="text-[10px] text-slate-400 truncate max-w-xs">{j.customerAddress}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-medium text-slate-800">{j.serviceType}</span>
                            </td>
                            <td className="py-3 px-3">
                              <StatusBadge status={j.status} size="sm" />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTechJobs(null);
                                  onViewJob(j);
                                }}
                                className="text-xs font-bold text-[#0A2342] hover:text-[#2EC4B6] transition-colors"
                              >
                                View Job →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTechJobs(null)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#0A2342] hover:bg-[#12335C] rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Add / Edit Technician Modal */}
      <Modal
        isOpen={techModalOpen}
        onClose={() => setTechModalOpen(false)}
        title={editingTech ? 'Edit Technician Profile' : 'Register New Technician'}
        subtitle={editingTech ? `Updating profile for ${editingTech.name}` : 'Add a certified aircon technician to dispatch roster'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveTech} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technician Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rafael Mendoza"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. 0917-555-8120"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technical Specialty / Expertise <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Split-Type Inverter Diagnostics & Circuit Board Repair"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rafael.mendoza@rgaircon.ph"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setTechModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#0A2342] hover:bg-[#12335C] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingTech ? 'Update Technician' : 'Register Technician'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
