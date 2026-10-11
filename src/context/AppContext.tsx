import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  User, 
  Technician, 
  Customer, 
  ServiceJob, 
  AdminTab, 
  ServiceType, 
  AirconUnit, 
  CompletionReport 
} from '../types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_TECHNICIANS, 
  INITIAL_USERS, 
  INITIAL_SERVICE_JOBS 
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface CreateJobParams {
  customerId?: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  aircon: AirconUnit;
  complaint: string;
  serviceType: ServiceType;
  preferredDate?: string;
  adminRemarks?: string;
  technicianId: string;
}

interface ReassignParams {
  jobId: string;
  newTechnicianId: string;
  reason?: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  technicians: Technician[];
  customers: Customer[];
  jobs: ServiceJob[];
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Job Actions
  createJob: (params: CreateJobParams) => ServiceJob;
  reassignTechnician: (params: ReassignParams) => void;
  startJob: (jobId: string) => void;
  putJobOnHold: (jobId: string, reason: string) => void;
  resumeJob: (jobId: string) => void;
  completeJob: (jobId: string, report: Omit<CompletionReport, 'completedByTechId' | 'completedByTechName' | 'completedAt'>) => void;
  
  // Customer & Technician Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  addTechnician: (tech: Omit<Technician, 'id'>) => Technician;
  updateTechnician: (tech: Technician) => void;
  toggleTechnicianActive: (id: string) => void;
  
  // Helpers
  getCustomerJobs: (customerId: string) => ServiceJob[];
  getTechnicianJobs: (technicianId: string) => ServiceJob[];
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'rg_current_user_v1',
  TECHS: 'rg_technicians_v1',
  CUSTOMERS: 'rg_customers_v1',
  JOBS: 'rg_service_jobs_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Admin by default
  });

  // 2. Technicians
  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TECHS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TECHNICIANS;
  });

  // 3. Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CUSTOMERS;
  });

  // 4. Jobs
  const [jobs, setJobs] = useState<ServiceJob[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SERVICE_JOBS;
  });

  // UI States
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  // Toast Helpers
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to generate sequential SRV-2026-XXXX Job IDs
  const generateJobId = (): string => {
    const currentYear = new Date().getFullYear();
    const prefix = `SRV-${currentYear}-`;
    let maxNum = 0;
    
    jobs.forEach((j) => {
      if (j.id.startsWith(prefix)) {
        const numPart = parseInt(j.id.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });

    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(4, '0')}`;
  };

  // Create Service Assignment
  const createJob = (params: CreateJobParams): ServiceJob => {
    const tech = technicians.find((t) => t.id === params.technicianId) || technicians[0];
    const newJobId = generateJobId();
    const nowISO = new Date().toISOString();

    // Check if customer exists or create new one
    let assignedCustomerId = params.customerId;
    if (!assignedCustomerId) {
      const existingCustomer = customers.find(
        (c) => c.name.toLowerCase().trim() === params.customerName.toLowerCase().trim()
      );
      if (existingCustomer) {
        assignedCustomerId = existingCustomer.id;
      } else {
        const newCustId = `CUST-${(customers.length + 1).toString().padStart(3, '0')}`;
        const newCust: Customer = {
          id: newCustId,
          name: params.customerName.trim(),
          contactNumber: params.customerContact.trim(),
          address: params.customerAddress.trim(),
          createdAt: nowISO
        };
        setCustomers((prev) => [...prev, newCust]);
        assignedCustomerId = newCustId;
      }
    }

    const newJob: ServiceJob = {
      id: newJobId,
      customerId: assignedCustomerId,
      customerName: params.customerName.trim(),
      customerContact: params.customerContact.trim(),
      customerAddress: params.customerAddress.trim(),
      aircon: params.aircon,
      complaint: params.complaint.trim(),
      serviceType: params.serviceType,
      preferredDate: params.preferredDate || new Date().toISOString().split('T')[0],
      adminRemarks: params.adminRemarks?.trim() || '',
      assignedTechnicianId: tech.id,
      assignedTechnicianName: tech.name,
      originalTechnicianId: tech.id,
      originalTechnicianName: tech.name,
      assignedAt: nowISO,
      status: 'Assigned',
      reassignments: [],
      statusHistory: [
        {
          status: 'Assigned',
          timestamp: nowISO,
          updatedBy: currentUser.name,
          remarks: `Service job created and assigned to ${tech.name}`
        }
      ]
    };

    setJobs((prev) => [newJob, ...prev]);
    addToast({
      type: 'success',
      title: 'Assignment Created',
      message: `Job ${newJobId} successfully assigned to ${tech.name}.`
    });

    return newJob;
  };

  // Reassign Technician
  const reassignTechnician = ({ jobId, newTechnicianId, reason }: ReassignParams) => {
    const job = jobs.find((j) => j.id === jobId);
    const newTech = technicians.find((t) => t.id === newTechnicianId);
    
    if (!job || !newTech) return;
    if (job.assignedTechnicianId === newTechnicianId) {
      addToast({
        type: 'info',
        title: 'Already Assigned',
        message: `${newTech.name} is already the assigned technician.`
      });
      return;
    }

    const nowISO = new Date().toISOString();
    const reassignmentRecord = {
      id: `reassign-${Date.now()}`,
      fromTechnicianId: job.assignedTechnicianId,
      fromTechnicianName: job.assignedTechnicianName,
      toTechnicianId: newTech.id,
      toTechnicianName: newTech.name,
      reassignedAt: nowISO,
      reason: reason?.trim() || 'Admin schedule optimization / technician workload balancing',
      reassignedBy: currentUser.name
    };

    const statusLog = {
      status: job.status,
      timestamp: nowISO,
      updatedBy: currentUser.name,
      remarks: `Technician changed from ${job.assignedTechnicianName} to ${newTech.name}. Reason: ${reassignmentRecord.reason}`
    };

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            assignedTechnicianId: newTech.id,
            assignedTechnicianName: newTech.name,
            reassignments: [...j.reassignments, reassignmentRecord],
            statusHistory: [...j.statusHistory, statusLog]
          };
        }
        return j;
      })
    );

    addToast({
      type: 'success',
      title: 'Technician Reassigned',
      message: `${job.id} reassigned to ${newTech.name}. Previous history recorded.`
    });
  };

  // Technician starts job
  const startJob = (jobId: string) => {
    const nowISO = new Date().toISOString();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'In Progress',
            startedAt: j.startedAt || nowISO,
            statusHistory: [
              ...j.statusHistory,
              {
                status: 'In Progress',
                timestamp: nowISO,
                updatedBy: currentUser.name,
                remarks: 'Technician started service job on-site.'
              }
            ]
          };
        }
        return j;
      })
    );

    addToast({
      type: 'info',
      title: 'Job In Progress',
      message: `${jobId} status updated to In Progress.`
    });
  };

  // Technician puts job on hold
  const putJobOnHold = (jobId: string, reason: string) => {
    const nowISO = new Date().toISOString();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'On Hold',
            onHoldReason: reason,
            statusHistory: [
              ...j.statusHistory,
              {
                status: 'On Hold',
                timestamp: nowISO,
                updatedBy: currentUser.name,
                remarks: `Job placed on hold: ${reason}`
              }
            ]
          };
        }
        return j;
      })
    );

    addToast({
      type: 'warning',
      title: 'Job Placed On Hold',
      message: `${jobId} put on hold. Admin notified.`
    });
  };

  // Resume job from on hold
  const resumeJob = (jobId: string) => {
    const nowISO = new Date().toISOString();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'In Progress',
            onHoldReason: undefined,
            statusHistory: [
              ...j.statusHistory,
              {
                status: 'In Progress',
                timestamp: nowISO,
                updatedBy: currentUser.name,
                remarks: 'Service resumed by technician.'
              }
            ]
          };
        }
        return j;
      })
    );

    addToast({
      type: 'info',
      title: 'Job Resumed',
      message: `${jobId} is back In Progress.`
    });
  };

  // Complete job with report & photos
  const completeJob = (
    jobId: string, 
    report: Omit<CompletionReport, 'completedByTechId' | 'completedByTechName' | 'completedAt'>
  ) => {
    const nowISO = new Date().toISOString();
    const currentTechName = currentUser.name;
    const currentTechId = currentUser.technicianId || 'TECH-01';

    const fullReport: CompletionReport = {
      ...report,
      completedByTechId: currentTechId,
      completedByTechName: currentTechName,
      completedAt: nowISO
    };

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'Completed',
            completedAt: nowISO,
            completionReport: fullReport,
            statusHistory: [
              ...j.statusHistory,
              {
                status: 'Completed',
                timestamp: nowISO,
                updatedBy: currentTechName,
                remarks: `Service completed and completion report submitted by ${currentTechName}.`
              }
            ]
          };
        }
        return j;
      })
    );

    addToast({
      type: 'success',
      title: 'Job Completed!',
      message: `${jobId} report submitted successfully. Great job!`
    });
  };

  // Add Customer
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newId = `CUST-${(customers.length + 1).toString().padStart(3, '0')}`;
    const newCust: Customer = {
      ...customerData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [...prev, newCust]);
    addToast({
      type: 'success',
      title: 'Customer Added',
      message: `${newCust.name} added to records.`
    });
    return newCust;
  };

  // Update Customer
  const updateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    // Also update customer name / contact / address in jobs for consistency without erasing history
    setJobs((prev) =>
      prev.map((j) => {
        if (j.customerId === updated.id) {
          return {
            ...j,
            customerName: updated.name,
            customerContact: updated.contactNumber,
            customerAddress: updated.address
          };
        }
        return j;
      })
    );
    addToast({
      type: 'info',
      title: 'Customer Updated',
      message: `${updated.name}'s contact details updated.`
    });
  };

  // Add Technician
  const addTechnician = (techData: Omit<Technician, 'id'>): Technician => {
    const newId = `TECH-${(technicians.length + 1).toString().padStart(2, '0')}`;
    const newTech: Technician = {
      ...techData,
      id: newId
    };
    setTechnicians((prev) => [...prev, newTech]);
    addToast({
      type: 'success',
      title: 'Technician Registered',
      message: `${newTech.name} added to roster.`
    });
    return newTech;
  };

  // Update Technician
  const updateTechnician = (updated: Technician) => {
    setTechnicians((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    addToast({
      type: 'info',
      title: 'Technician Updated',
      message: `${updated.name}'s profile updated.`
    });
  };

  // Toggle Technician Active
  const toggleTechnicianActive = (id: string) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextActive = !t.active;
          addToast({
            type: nextActive ? 'success' : 'warning',
            title: `Technician ${nextActive ? 'Activated' : 'Deactivated'}`,
            message: `${t.name} is now ${nextActive ? 'active' : 'inactive'}.`
          });
          return { ...t, active: nextActive };
        }
        return t;
      })
    );
  };

  // Get jobs for customer
  const getCustomerJobs = (customerId: string): ServiceJob[] => {
    return jobs.filter((j) => j.customerId === customerId);
  };

  // Get jobs for technician
  const getTechnicianJobs = (technicianId: string): ServiceJob[] => {
    return jobs.filter((j) => j.assignedTechnicianId === technicianId);
  };

  // Reset to initial mock data
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.TECHS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setJobs(INITIAL_SERVICE_JOBS);
    setCustomers(INITIAL_CUSTOMERS);
    setTechnicians(INITIAL_TECHNICIANS);
    setCurrentUser(INITIAL_USERS[0]);
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'Demo dataset restored to initial state.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        technicians,
        customers,
        jobs,
        adminTab,
        setAdminTab,
        selectedJobId,
        setSelectedJobId,
        isMobilePreview,
        setIsMobilePreview,
        toasts,
        addToast,
        removeToast,
        createJob,
        reassignTechnician,
        startJob,
        putJobOnHold,
        resumeJob,
        completeJob,
        addCustomer,
        updateCustomer,
        addTechnician,
        updateTechnician,
        toggleTechnicianActive,
        getCustomerJobs,
        getTechnicianJobs,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
