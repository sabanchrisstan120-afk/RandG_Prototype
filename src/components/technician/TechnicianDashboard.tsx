import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { ServiceJob } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Search
} from 'lucide-react';

interface TechnicianDashboardProps {
  onSelectJob: (job: ServiceJob) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ onSelectJob }) => {
  const { currentUser, jobs } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'Assigned' | 'In Progress' | 'Completed'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Get only jobs assigned to current logged-in technician!
  const techId = currentUser.technicianId || 'TECH-01';
  const myJobs = useMemo(() => {
    return jobs.filter((j) => j.assignedTechnicianId === techId);
  }, [jobs, techId]);

  // Counts
  const todayCount = myJobs.filter((j) => j.status === 'Assigned').length;
  const inProgressCount = myJobs.filter((j) => j.status === 'In Progress').length;
  const completedCount = myJobs.filter((j) => j.status === 'Completed').length;

  const filteredJobs = useMemo(() => {
    return myJobs.filter((job) => {
      // Tab filter
      if (activeTab !== 'ALL' && job.status !== activeTab) {
        return false;
      }
      // Search
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        return (
          job.id.toLowerCase().includes(q) ||
          job.customerName.toLowerCase().includes(q) ||
          job.customerAddress.toLowerCase().includes(q) ||
          job.serviceType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [myJobs, activeTab, searchQuery]);

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0A2342] text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
              alt={currentUser.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#2EC4B6]"
            />
            <div>
              <span className="text-[10px] text-[#2EC4B6] font-bold uppercase tracking-wider">
                Field Technician Portal
              </span>
              <h1 className="text-base font-bold text-white">
                {currentUser.name}
              </h1>
              <p className="text-[11px] text-slate-300">
                {myJobs.length} active work orders assigned to you
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI Pills */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-navy-700/80 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('Assigned')}
            className={`p-2 rounded-xl transition-all ${
              activeTab === 'Assigned' ? 'bg-[#2EC4B6] text-[#0A2342]' : 'bg-navy-900/60 text-white'
            }`}
          >
            <span className="text-[10px] font-semibold block opacity-80">To Do</span>
            <span className="text-base font-black">{todayCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('In Progress')}
            className={`p-2 rounded-xl transition-all ${
              activeTab === 'In Progress' ? 'bg-amber-400 text-amber-950' : 'bg-navy-900/60 text-white'
            }`}
          >
            <span className="text-[10px] font-semibold block opacity-80">In Progress</span>
            <span className="text-base font-black">{inProgressCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Completed')}
            className={`p-2 rounded-xl transition-all ${
              activeTab === 'Completed' ? 'bg-emerald-400 text-emerald-950' : 'bg-navy-900/60 text-white'
            }`}
          >
            <span className="text-[10px] font-semibold block opacity-80">Done</span>
            <span className="text-base font-black">{completedCount}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold">
        {(['ALL', 'Assigned', 'In Progress', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#0A2342] text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Jobs' : tab}
          </button>
        ))}
      </div>

      {/* Simple Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by customer name, address, or Job ID..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
        />
      </div>

      {/* Job Cards List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 text-xs space-y-1">
            <p className="font-semibold text-slate-700">No assigned jobs found in this category.</p>
            <p className="text-slate-400">Great job staying on top of your schedule!</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all space-y-3 cursor-pointer group"
            >
              {/* Top Row: Job ID & Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0A2342] bg-slate-100 px-2 py-0.5 rounded">
                    {job.id}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {job.serviceType}
                  </span>
                </div>
                <StatusBadge status={job.status} size="sm" />
              </div>

              {/* Customer & Address */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0A2342] transition-colors">
                  {job.customerName}
                </h3>
                <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{job.customerAddress}</span>
                </div>
              </div>

              {/* Unit & Scheduled Date */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-medium text-slate-700">
                  {job.aircon.brand} • {job.aircon.type} ({job.aircon.capacityHp || 'HP'})
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{job.preferredDate || 'Today'}</span>
                </span>
              </div>

              {/* View Job CTA Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectJob(job);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 group-hover:bg-[#0A2342] text-[#0A2342] group-hover:text-white border border-slate-200 group-hover:border-[#0A2342] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <span>View Job Details & Actions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
