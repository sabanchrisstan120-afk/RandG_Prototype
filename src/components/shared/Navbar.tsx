import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/mockData';
import { 
  Wrench, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  ChevronDown, 
  UserCheck, 
  Wind,
  PhoneCall
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    isMobilePreview, 
    setIsMobilePreview, 
    resetAllData,
    setSelectedJobId
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSelectUser = (user: typeof INITIAL_USERS[0]) => {
    setCurrentUser(user);
    setSelectedJobId(null);
    setRoleMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A2342] text-white border-b border-navy-700/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2EC4B6] to-[#55D4C9] flex items-center justify-center text-[#0A2342] shadow-sm font-bold">
                <Wind className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    R&G AIRCON
                  </span>
                  <span className="bg-[#2EC4B6]/20 text-[#2EC4B6] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2EC4B6]/30 uppercase tracking-wider">
                    Service Center
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block">
                  Repair & Installation Operations Management • Pasig City
                </p>
              </div>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile View Simulator Button (for testing Technician UX on desktop) */}
              <button
                type="button"
                onClick={() => setIsMobilePreview(!isMobilePreview)}
                title={isMobilePreview ? "Switch to Full Width Mode" : "Simulate Mobile Device (Technician View)"}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  isMobilePreview 
                    ? 'bg-[#2EC4B6] text-[#0A2342] border-[#2EC4B6] shadow-xs' 
                    : 'bg-navy-900/60 text-slate-200 border-white/10 hover:bg-navy-700/80 hover:text-white'
                }`}
              >
                {isMobilePreview ? (
                  <>
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop Mode</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Frame</span>
                  </>
                )}
              </button>

              {/* Reset Demo Data Button */}
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                title="Reset prototype demo data"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-navy-900/40 hover:bg-rose-500/20 border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Reset Demo</span>
              </button>

              {/* Role Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-navy-900/80 hover:bg-navy-700 border border-white/15 transition-all text-left group"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#2EC4B6]"
                  />
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white group-hover:text-[#2EC4B6] transition-colors leading-none">
                        {currentUser.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {currentUser.role === 'admin' ? (
                        <span className="text-[10px] text-amber-300 font-medium flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> Admin
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#2EC4B6] font-medium flex items-center gap-0.5">
                          <Wrench className="w-2.5 h-2.5" /> Technician
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* Dropdown Menu */}
                {roleMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setRoleMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Switch Prototype Role
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Simulate Admin vs Technician workflows:
                        </p>
                      </div>

                      <div className="p-1.5 space-y-1">
                        {INITIAL_USERS.map((user) => {
                          const isSelected = user.id === currentUser.id;
                          return (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleSelectUser(user)}
                              className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                                isSelected 
                                  ? 'bg-slate-100 ring-1 ring-slate-300 font-semibold' 
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 truncate">
                                    {user.name}
                                  </span>
                                  {isSelected && (
                                    <UserCheck className="w-3.5 h-3.5 text-[#2EC4B6] shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                    user.role === 'admin' 
                                      ? 'bg-amber-100 text-amber-800' 
                                      : 'bg-teal-50 text-teal-700 border border-teal-200'
                                  }`}>
                                    {user.role}
                                  </span>
                                  <span className="text-[11px] text-slate-400 truncate">
                                    {user.title || user.email}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-[#2EC4B6]" />
                        <span>R&G Dispatch Hotline: (02) 8652-9100</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h4 className="text-base font-bold text-slate-900">
              Restore Demo Dataset?
            </h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              This will restore the original demo service assignments (including Juan Dela Cruz's repair, cleaning, and installation jobs) and clear any temporary changes in local storage.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
