import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RotateCcw,
  PieChart,
  Users
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { jobs, technicians } = useApp();

  const [techFilter, setTechFilter] = useState<string>('ALL');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Tech filter
      if (techFilter !== 'ALL' && job.assignedTechnicianId !== techFilter) {
        return false;
      }
      return true;
    });
  }, [jobs, techFilter]);

  // Aggregate stats
  const total = filteredJobs.length;
  const completed = filteredJobs.filter((j) => j.status === 'Completed').length;
  const inProgress = filteredJobs.filter((j) => j.status === 'In Progress').length;
  const assigned = filteredJobs.filter((j) => j.status === 'Assigned').length;

  // Breakdown by Service Type
  const repairCount = filteredJobs.filter((j) => j.serviceType === 'Repair').length;
  const cleaningCount = filteredJobs.filter((j) => j.serviceType === 'Cleaning').length;
  const installCount = filteredJobs.filter((j) => j.serviceType === 'Installation').length;
  const maintenanceCount = filteredJobs.filter((j) => j.serviceType === 'Maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Operational Service Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of job completion rates, technician productivity, and service category breakdown
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-[#2EC4B6]"
          >
            <option value="ALL">All Technicians</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setTechFilter('ALL')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset report filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Filtered Total
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {total}
          </span>
          <span className="text-[10px] text-slate-500">Service work orders</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
            Completed & Verified
          </span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">
            {completed}
          </span>
          <span className="text-[10px] text-emerald-700">
            {total > 0 ? Math.round((completed / total) * 100) : 0}% completion rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
            In Progress (Active)
          </span>
          <span className="text-2xl font-black text-amber-900 mt-1 block">
            {inProgress}
          </span>
          <span className="text-[10px] text-amber-700">Under on-site servicing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
            Pending / Assigned
          </span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">
            {assigned}
          </span>
          <span className="text-[10px] text-blue-700">Awaiting technician arrival</span>
        </div>
      </div>

      {/* Service Type Breakdown & Technician Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Type Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Service Type Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Comparison of Repair vs Cleaning vs Installation
              </p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {/* Repair */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Repair (Troubleshooting & Capacitors/Gas)</span>
                <span>{repairCount} jobs ({total > 0 ? Math.round((repairCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#0A2342] h-full rounded-full transition-all duration-300" 
                  style={{ width: `${total > 0 ? (repairCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cleaning */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Cleaning (Hydro-Wash & Sanitization)</span>
                <span>{cleaningCount} jobs ({total > 0 ? Math.round((cleaningCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#2EC4B6] h-full rounded-full transition-all duration-300" 
                  style={{ width: `${total > 0 ? (cleaningCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Installation */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Installation (Mounting & Piping)</span>
                <span>{installCount} jobs ({total > 0 ? Math.round((installCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${total > 0 ? (installCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Maintenance */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Maintenance (12-Point Inspection)</span>
                <span>{maintenanceCount} jobs ({total > 0 ? Math.round((maintenanceCount / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${total > 0 ? (maintenanceCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technician Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Jobs Per Technician
              </h2>
              <p className="text-xs text-slate-500">
                Performance and completion breakdown by assigned personnel
              </p>
            </div>
            <Users className="w-5 h-5 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Technician</th>
                  <th className="py-2.5 px-3 text-center">Assigned</th>
                  <th className="py-2.5 px-3 text-center">In Progress</th>
                  <th className="py-2.5 px-3 text-center">Completed</th>
                  <th className="py-2.5 px-3 text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {technicians.map((t) => {
                  const tJobs = jobs.filter((j) => j.assignedTechnicianId === t.id);
                  const tAssigned = tJobs.filter((j) => j.status === 'Assigned').length;
                  const tProgress = tJobs.filter((j) => j.status === 'In Progress').length;
                  const tCompleted = jobs.filter((j) => j.completionReport?.completedByTechId === t.id).length;
                  const totalHandled = tJobs.length;
                  const rate = totalHandled > 0 ? Math.round((tCompleted / totalHandled) * 100) : 0;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900">{t.name}</span>
                        <div className="text-[10px] text-slate-400">{t.specialty}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-800">{tAssigned}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-800">{tProgress}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-800">{tCompleted}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">{rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
