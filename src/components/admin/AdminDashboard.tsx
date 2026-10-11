import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ServiceJob } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  ClipboardList, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  Users, 
  PlusCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onViewJob: (job: ServiceJob) => void;
  onOpenReassign: (job: ServiceJob) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewJob,
  onOpenReassign
}) => {
  const { jobs, technicians, setAdminTab } = useApp();

  const totalJobs = jobs.length;
  const assignedJobs = jobs.filter((j) => j.status === 'Assigned').length;
  const inProgressJobs = jobs.filter((j) => j.status === 'In Progress').length;
  const completedJobs = jobs.filter((j) => j.status === 'Completed').length;
  const totalTechs = technicians.length;

  const attentionJobs = jobs.filter((j) => j.status === 'On Hold');
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A2342] to-[#12335C] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#2EC4B6]/20 text-[#2EC4B6] text-xs font-bold border border-[#2EC4B6]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operations Live Command</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            R&G Aircon Service Center Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor real-time repair and installation dispatches, technician workload, customer history, and completion reports across Metro Manila.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdminTab('new-assignment')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#2EC4B6] hover:bg-[#209F93] text-[#0A2342] shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ New Service Assignment</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Jobs
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalJobs}
            </span>
            <span className="text-[10px] text-slate-500">All registered records</span>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
              Assigned
            </span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">
              {assignedJobs}
            </span>
            <span className="text-[10px] text-blue-600/80">Dispatched & awaiting start</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
              In Progress
            </span>
            <span className="text-2xl font-black text-amber-900 mt-1 block">
              {inProgressJobs}
            </span>
            <span className="text-[10px] text-amber-600/80">Active on-site work</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
            <PlayCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
              Completed
            </span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block">
              {completedJobs}
            </span>
            <span className="text-[10px] text-emerald-600/80">With verified photos</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between col-span-2 lg:col-span-1">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A2342] block">
              Technicians
            </span>
            <span className="text-2xl font-black text-[#0A2342] mt-1 block">
              {totalTechs}
            </span>
            <span className="text-[10px] text-slate-500">Active roster field staff</span>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-[#2EC4B6]">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Technician Workload Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Technician Field Workload Summary
            </h2>
            <p className="text-xs text-slate-500">
              Real-time assignment distribution across certified aircon technicians
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAdminTab('technicians')}
            className="text-xs font-semibold text-[#0A2342] hover:text-[#2EC4B6] flex items-center gap-1 transition-colors"
          >
            <span>Manage Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {technicians.map((tech) => {
            const techJobs = jobs.filter((j) => j.assignedTechnicianId === tech.id);
            const techAssigned = techJobs.filter((j) => j.status === 'Assigned').length;
            const techInProgress = techJobs.filter((j) => j.status === 'In Progress').length;
            const techCompleted = techJobs.filter((j) => j.status === 'Completed').length;

            return (
              <div
                key={tech.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-300"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {tech.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {tech.specialty}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${tech.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span className="text-[10px] text-slate-500">
                        {tech.active ? 'Available for Dispatch' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-200 text-center">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Assigned</span>
                    <span className="text-xs font-black text-blue-700">{techAssigned}</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Active</span>
                    <span className="text-xs font-black text-amber-700">{techInProgress}</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block">Done</span>
                    <span className="text-xs font-black text-emerald-700">{techCompleted}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Attention Needed & Recent Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs Requiring Attention */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-bold text-slate-900">
                Jobs Requiring Attention
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              {attentionJobs.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Assignments paused On Hold awaiting parts, customer access, or approvals.
          </p>

          {attentionJobs.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-slate-50 text-slate-400 text-xs">
              No jobs currently On Hold. Operations flowing smoothly!
            </div>
          ) : (
            <div className="space-y-2.5">
              {attentionJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-xl border border-orange-200 bg-orange-50/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-orange-900">{job.id}</span>
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                  <p className="font-semibold text-slate-900">{job.customerName}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    <strong>Hold reason:</strong> {job.onHoldReason || 'Awaiting customer/parts update'}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">Tech: {job.assignedTechnicianName}</span>
                    <button
                      type="button"
                      onClick={() => onViewJob(job)}
                      className="text-xs font-bold text-[#0A2342] hover:text-[#2EC4B6] transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Service Assignments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Service Assignments
              </h2>
              <p className="text-xs text-slate-500">
                Latest customer repair, cleaning, and installation work orders
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAdminTab('assignments')}
              className="text-xs font-semibold text-[#0A2342] hover:text-[#2EC4B6] flex items-center gap-1 transition-colors"
            >
              <span>View All Assignments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Job ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Service Type</th>
                  <th className="py-2.5 px-3">Technician</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#0A2342]">
                      {job.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{job.customerName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{job.customerAddress}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 text-[11px]">
                        {job.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{job.assignedTechnicianName}</span>
                      {job.reassignments.length > 0 && (
                        <span className="text-[9px] text-blue-600 block">
                          (Reassigned {job.reassignments.length}x)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={job.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onViewJob(job)}
                        className="text-xs font-bold text-[#0A2342] hover:text-[#2EC4B6] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                      {!['Completed', 'Cancelled'].includes(job.status) && (
                        <button
                          type="button"
                          onClick={() => onOpenReassign(job)}
                          className="text-[11px] text-slate-500 hover:text-blue-700 transition-colors cursor-pointer"
                        >
                          Reassign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
