import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AdminTab } from '../../types';
import { 
  LayoutDashboard, 
  ClipboardList, 
  PlusCircle, 
  Users, 
  Wrench, 
  History, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';

export const Sidebar: React.FC = () => {
  const { adminTab, setAdminTab, jobs, setCurrentUser } = useApp();

  const assignedCount = jobs.filter((j) => j.status === 'Assigned').length;
  const inProgressCount = jobs.filter((j) => j.status === 'In Progress').length;
  const onHoldCount = jobs.filter((j) => j.status === 'On Hold').length;

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'assignments',
      label: 'Service Assignments',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: assignedCount + inProgressCount,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'new-assignment',
      label: 'New Assignment',
      icon: <PlusCircle className="w-4 h-4" />
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'technicians',
      label: 'Technicians',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      id: 'service-history',
      label: 'Service History',
      icon: <History className="w-4 h-4" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0 shadow-xs">
      {/* Navigation List */}
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Operations Menu
        </div>

        {navItems.map((item) => {
          const isActive = adminTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setAdminTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0A2342] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#2EC4B6]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#2EC4B6] text-[#0A2342]' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Attention badge if on-hold jobs */}
        {onHoldCount > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-xs font-bold">Attention Needed</span>
            </div>
            <p className="mt-1 text-[11px] text-orange-700 leading-tight">
              {onHoldCount} {onHoldCount === 1 ? 'job is' : 'jobs are'} currently On Hold and awaiting parts/action.
            </p>
          </div>
        )}
      </div>

      {/* Bottom User Quick Switch / Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
        <div className="text-[11px] text-slate-400 font-medium px-1">
          Logged in as Operations Admin
        </div>
        <button
          type="button"
          onClick={() => setCurrentUser(INITIAL_USERS[1])} // Switch to Mark Santos (Technician)
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#0A2342] transition-colors cursor-pointer shadow-xs"
        >
          <Wrench className="w-3.5 h-3.5 text-[#2EC4B6]" />
          <span>Switch to Technician View</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentUser(INITIAL_USERS[0])}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
