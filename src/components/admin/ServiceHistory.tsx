import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ServiceJob } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ServiceHistoryProps {
  onViewJob: (job: ServiceJob) => void;
}

export const ServiceHistory: React.FC<ServiceHistoryProps> = ({ onViewJob }) => {
  const { customers, jobs } = useApp();

  // Search input & selected customer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(() => {
    // Default to Juan Dela Cruz (CUST-001) as explicitly highlighted in Section 5
    return customers.length > 0 ? customers[0].id : '';
  });

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.contactNumber.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerJobs = jobs.filter((j) => j.customerId === activeCustomer?.id);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      return new Date(isoStr).toLocaleString('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit & Historical Accountability</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Customer Service & Technician Assignment History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Preserves the full audit trail of who was originally assigned, any reassignment changes with reasons, and which technician actually completed the service on-site.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Customer Selection Sidebar & Service Jobs Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Select Customer Record
            </h2>

            {/* Customer Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer name..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>

            {/* Customer List */}
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredCustomers.map((c) => {
                const count = jobs.filter((j) => j.customerId === c.id).length;
                const isSelected = c.id === activeCustomer?.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A2342] text-white shadow-xs'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {c.name}
                        </span>
                      </div>
                      <span className={`text-[11px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {c.contactNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-[#2EC4B6] text-[#0A2342]' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {count} {count === 1 ? 'Job' : 'Jobs'}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Customer History & Work Order Table (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeCustomer ? (
            <>
              {/* Selected Customer Header Profile */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      CLIENT ID: {activeCustomer.id}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      Customer: {activeCustomer.name}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{activeCustomer.contactNumber}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{activeCustomer.address}</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Lifetime Work Orders
                    </span>
                    <span className="text-xl font-black text-[#0A2342]">
                      {customerJobs.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exact Table Format from Section 5 Specification */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Service Assignments for {activeCustomer.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Click any assignment row to open deep audit record
                  </span>
                </div>

                {customerJobs.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 text-xs">
                    No service jobs recorded yet for {activeCustomer.name}.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Job ID</th>
                          <th className="py-3 px-4">Service Type</th>
                          <th className="py-3 px-4">Aircon Unit</th>
                          <th className="py-3 px-4">Assigned Technician</th>
                          <th className="py-3 px-4">Performed By</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customerJobs.map((job) => {
                          const completedBy = job.completionReport ? job.completionReport.completedByTechName : null;
                          const hasReassignments = job.reassignments.length > 0;

                          return (
                            <tr
                              key={job.id}
                              onClick={() => onViewJob(job)}
                              className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                            >
                              <td className="py-3.5 px-4 font-mono font-bold text-[#0A2342]">
                                <div className="flex items-center gap-1.5">
                                  <span>{job.id}</span>
                                  {hasReassignments && (
                                    <span 
                                      title="Reassigned technician record"
                                      className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded"
                                    >
                                      Reassigned
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-semibold text-slate-800">
                                {job.serviceType}
                              </td>

                              <td className="py-3.5 px-4 text-slate-600">
                                <div>{job.aircon.brand} • {job.aircon.type}</div>
                                <div className="text-[10px] text-slate-400">{job.aircon.capacityHp || 'Standard'}</div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-slate-900">
                                  {job.assignedTechnicianName}
                                </div>
                                {hasReassignments && (
                                  <div className="text-[10px] text-blue-600">
                                    Originally: {job.originalTechnicianName}
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                {completedBy ? (
                                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{completedBy}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">In progress / pending</span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <StatusBadge status={job.status} size="sm" />
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewJob(job);
                                  }}
                                  className="text-xs font-bold text-[#0A2342] hover:text-[#2EC4B6] transition-colors"
                                >
                                  Open History →
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Breakdown Cards for Each Job for this Customer */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detailed Audit Timeline for {activeCustomer.name}
                </h3>

                {customerJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0A2342] bg-slate-100 px-2 py-0.5 rounded">
                          {job.id}
                        </span>
                        <span className="font-bold text-sm text-slate-900">
                          {job.serviceType} ({job.aircon.brand} {job.aircon.type})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={job.status} size="sm" />
                        <button
                          type="button"
                          onClick={() => onViewJob(job)}
                          className="text-xs font-bold text-[#0A2342] hover:text-[#2EC4B6] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          View Full Record
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Complaint */}
                      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
                        <span className="text-[10px] uppercase font-bold text-amber-800 block mb-1">
                          Reported Complaint:
                        </span>
                        <p className="text-slate-700 italic">"{job.complaint}"</p>
                      </div>

                      {/* Work Performed */}
                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                          Technician Actual Findings / Work:
                        </span>
                        {job.completionReport ? (
                          <p className="text-slate-800">{job.completionReport.workPerformed}</p>
                        ) : (
                          <p className="text-slate-500 italic">Service is currently {job.status.toLowerCase()}.</p>
                        )}
                      </div>
                    </div>

                    {/* Timeline & Reassignments */}
                    <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                      <div className="flex items-center gap-3">
                        <span>Assigned: <strong>{job.assignedTechnicianName}</strong></span>
                        {job.reassignments.length > 0 && (
                          <span className="text-blue-700 font-semibold">
                            (Reassigned from {job.reassignments[0].fromTechnicianName})
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Assigned At: {formatDate(job.assignedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Select a customer on the left to view their service and technician assignment history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
