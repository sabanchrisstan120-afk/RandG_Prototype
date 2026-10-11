import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import type { ServiceJob, ServicePhoto } from './types';
import { Navbar } from './components/shared/Navbar';
import { Sidebar } from './components/shared/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { JobDetailModal } from './components/shared/JobDetailModal';
import { ReassignModal } from './components/shared/ReassignModal';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServiceAssignments } from './components/admin/ServiceAssignments';
import { NewAssignmentForm } from './components/admin/NewAssignmentForm';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { TechnicianManagement } from './components/admin/TechnicianManagement';
import { ServiceHistory } from './components/admin/ServiceHistory';
import { ReportsView } from './components/admin/ReportsView';
import { SettingsView } from './components/admin/SettingsView';

// Technician Views
import { TechnicianDashboard } from './components/technician/TechnicianDashboard';
import { TechnicianJobDetail } from './components/technician/TechnicianJobDetail';
import { TechnicianHoldModal } from './components/technician/TechnicianHoldModal';
import { CompletionReportModal } from './components/technician/CompletionReportModal';

const AppContent: React.FC = () => {
  const { 
    currentUser, 
    adminTab, 
    setAdminTab,
    selectedJobId, 
    setSelectedJobId,
    jobs,
    isMobilePreview,
    startJob,
    putJobOnHold,
    resumeJob,
    completeJob
  } = useApp();

  // Modal states
  const [inspectJob, setInspectJob] = useState<ServiceJob | null>(null);
  const [reassignJob, setReassignJob] = useState<ServiceJob | null>(null);
  const [holdJobId, setHoldJobId] = useState<string | null>(null);
  const [completeJobTarget, setCompleteJobTarget] = useState<ServiceJob | null>(null);

  // For technician direct detail view
  const currentTechSelectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  const handleOpenJobInspection = (job: ServiceJob) => {
    setInspectJob(job);
  };

  const handleOpenReassign = (job: ServiceJob) => {
    setReassignJob(job);
  };

  const handleStartJob = (jobId: string) => {
    startJob(jobId);
  };

  const handleConfirmHold = (reason: string) => {
    if (holdJobId) {
      putJobOnHold(holdJobId, reason);
      setHoldJobId(null);
    }
  };

  const handleResumeJob = (jobId: string) => {
    resumeJob(jobId);
  };

  const handleConfirmComplete = (
    jobId: string, 
    reportData: {
      workPerformed: string;
      findingsAndRecommendations?: string;
      photos: ServicePhoto[];
      confirmationChecked: boolean;
    }
  ) => {
    completeJob(jobId, reportData);
    setCompleteJobTarget(null);
    setSelectedJobId(null); // return to job list
  };

  // Render Admin Content based on active tab
  const renderAdminView = () => {
    switch (adminTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onViewJob={handleOpenJobInspection}
            onOpenReassign={handleOpenReassign}
          />
        );
      case 'assignments':
        return (
          <ServiceAssignments
            onViewJob={handleOpenJobInspection}
            onOpenReassign={handleOpenReassign}
          />
        );
      case 'new-assignment':
        return (
          <NewAssignmentForm
            onSuccess={() => {
              setAdminTab('assignments');
            }}
            onCancel={() => setAdminTab('assignments')}
          />
        );
      case 'customers':
        return <CustomerManagement onViewJob={handleOpenJobInspection} />;
      case 'technicians':
        return <TechnicianManagement onViewJob={handleOpenJobInspection} />;
      case 'service-history':
        return <ServiceHistory onViewJob={handleOpenJobInspection} />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <AdminDashboard
            onViewJob={handleOpenJobInspection}
            onOpenReassign={handleOpenReassign}
          />
        );
    }
  };

  // Render Technician Content
  const renderTechnicianContent = () => {
    if (currentTechSelectedJob) {
      return (
        <TechnicianJobDetail
          job={currentTechSelectedJob}
          onBack={() => setSelectedJobId(null)}
          onStartJob={handleStartJob}
          onOpenHoldModal={(id) => setHoldJobId(id)}
          onResumeJob={handleResumeJob}
          onOpenCompleteModal={(job) => setCompleteJobTarget(job)}
        />
      );
    }

    return (
      <TechnicianDashboard
        onSelectJob={(job) => setSelectedJobId(job.id)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Main Body */}
      {currentUser.role === 'admin' ? (
        // Admin Experience: Sidebar + Operations Canvas
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {renderAdminView()}
          </main>
        </div>
      ) : (
        // Technician Experience: Mobile-Optimized Interface
        <main className="flex-1 p-3 sm:p-6 flex justify-center items-start">
          {isMobilePreview ? (
            // Mobile Device Bezel Frame Simulator (iPhone style)
            <div className="my-2 relative w-[390px] min-h-[780px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col ring-1 ring-slate-900/10">
              {/* Phone Speaker Notch */}
              <div className="w-full h-7 bg-slate-900 flex items-center justify-center relative shrink-0">
                <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-6 h-1 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Phone Screen Viewport */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#F7F7F7]">
                {renderTechnicianContent()}
              </div>

              {/* Phone Home Bar Indicator */}
              <div className="w-full h-5 bg-[#F7F7F7] flex items-center justify-center shrink-0">
                <div className="w-28 h-1 rounded-full bg-slate-400" />
              </div>
            </div>
          ) : (
            // Standard responsive centered view
            <div className="w-full max-w-xl">
              {renderTechnicianContent()}
            </div>
          )}
        </main>
      )}

      {/* Global Modals */}
      <JobDetailModal
        job={inspectJob}
        isOpen={inspectJob !== null}
        onClose={() => setInspectJob(null)}
        onOpenReassign={(job) => setReassignJob(job)}
      />

      <ReassignModal
        job={reassignJob}
        isOpen={reassignJob !== null}
        onClose={() => setReassignJob(null)}
      />

      <TechnicianHoldModal
        jobId={holdJobId || ''}
        isOpen={holdJobId !== null}
        onClose={() => setHoldJobId(null)}
        onSubmit={handleConfirmHold}
      />

      <CompletionReportModal
        job={completeJobTarget}
        isOpen={completeJobTarget !== null}
        onClose={() => setCompleteJobTarget(null)}
        onSubmit={handleConfirmComplete}
      />

      {/* Real-time Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
