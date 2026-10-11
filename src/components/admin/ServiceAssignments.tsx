import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { ServiceJob, ServiceStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Search, 
  PlusCircle, 
  ArrowRightLeft, 
  Eye, 
  RotateCcw
} from 'lucide-react';

interface ServiceAssignmentsProps {
  onViewJob: (job: ServiceJob) => void;
  onOpenReassign: (job: ServiceJob) => void;
}

export const ServiceAssignments: React.FC<ServiceAssignmentsProps> = ({
  onViewJob,
  onOpenReassign
}) => {
  const { jobs, technicians, setAdminTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [techFilter, setTechFilter] = useState<string>('ALL');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search by Customer Name or Job ID or Address
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        job.id.toLowerCase().includes(q) ||
        job.customerName.toLowerCase().includes(q) ||
        job.customerAddress.toLowerCase().includes(q);

      // Status filter
      const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;

      // Technician filter
      const matchesTech = techFilter === 'ALL' || job.assignedTechnicianId === techFilter;

      // Service type filter
      const matchesType = serviceTypeFilter === 'ALL' || job.serviceType === serviceTypeFilter;

      // Date filter (matches assignment date or preferred date)
      const matchesDate = !dateFilter || 
        job.assignedAt.startsWith(dateFilter) || 
        (job.preferredDate && job.preferredDate === dateFilter);

      return matchesSearch && matchesStatus && matchesTech && matchesType && matchesDate;
    });
  }, [jobs, searchQuery, statusFilter, techFilter, serviceTypeFilter, dateFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTechFilter('ALL');
    setServiceTypeFilter('ALL');
    setDateFilter('');
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  const statuses: ('ALL' | ServiceStatus)[] = ['ALL', 'Assigned', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Service Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage dispatch orders, track status updates, and view technician assignment records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdminTab('new-assignment')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0A2342] hover:bg-[#12335C] text-white shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#2EC4B6]" />
          <span>+ New Service Assignment</span>
        </button>
      </div>

      {/* Search and Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, Job ID (e.g. SRV-2026-0001), or address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent placeholder:text-slate-400"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1 text-xs">
          {/* Status Select */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-[#2EC4B6]"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === 'ALL' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Technician Select */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Technician
            </label>
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-[#2EC4B6]"
            >
              <option value="ALL">All Technicians</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type Select */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Service Type
            </label>
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-[#2EC4B6]"
            >
              <option value="ALL">All Service Types</option>
              <option value="Repair">Repair</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Installation">Installation</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inspection">Inspection</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Service Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-[#2EC4B6]"
            />
          </div>

          {/* Reset Filters button */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Service Assignments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredJobs.length}</strong> of {jobs.length} total service records
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <p className="font-semibold text-slate-700">No service assignments match your filters.</p>
            <p className="text-slate-400">Try adjusting your search terms or clearing the active filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 px-3 py-1.5 text-xs font-semibold text-[#0A2342] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Job ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service Type</th>
                  <th className="py-3 px-4">Assigned Technician</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr 
                    key={job.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onViewJob(job)}
                  >
                    {/* Job ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A2342]">
                      <div className="flex items-center gap-1.5">
                        <span>{job.id}</span>
                        {job.reassignments.length > 0 && (
                          <span 
                            title={`Reassigned ${job.reassignments.length} time(s)`}
                            className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-200"
                          >
                            R
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{job.customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{job.customerAddress}</div>
                      <div className="text-[10px] font-mono text-slate-400">{job.customerContact}</div>
                    </td>

                    {/* Service Type */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 text-[11px]">
                        {job.serviceType}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {job.aircon.brand} • {job.aircon.type}
                      </div>
                    </td>

                    {/* Technician */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{job.assignedTechnicianName}</div>
                      {job.reassignments.length > 0 ? (
                        <div className="text-[10px] text-blue-600 font-medium">
                          Prev: {job.reassignments[job.reassignments.length - 1].fromTechnicianName}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">Direct Assignment</div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {formatDate(job.assignedAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={job.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td 
                      className="py-3.5 px-4 text-right space-x-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onViewJob(job)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0A2342] hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {!['Completed', 'Cancelled'].includes(job.status) && (
                        <button
                          type="button"
                          onClick={() => onOpenReassign(job)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Reassign</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
