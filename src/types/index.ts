export type UserRole = 'admin' | 'technician';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  technicianId?: string;
  email: string;
  avatar?: string;
  title?: string;
}

export interface Technician {
  id: string;
  name: string;
  contactNumber: string;
  specialty: string;
  active: boolean;
  avatar?: string;
  email?: string;
  joinedDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export type AirconType = 'Window' | 'Split-Type' | 'Inverter' | 'Floor Mounted' | 'Cassette' | 'Other';

export interface AirconUnit {
  brand: string;
  type: AirconType;
  capacityHp?: string;
  details?: string;
}

export type ServiceType = 'Repair' | 'Cleaning' | 'Installation' | 'Maintenance' | 'Inspection' | 'Other';

export type ServiceStatus = 'Assigned' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export interface ServicePhoto {
  id: string;
  url: string;
  type: 'before' | 'after' | 'general';
  caption?: string;
  uploadedAt: string;
}

export interface ReassignmentRecord {
  id: string;
  fromTechnicianId: string;
  fromTechnicianName: string;
  toTechnicianId: string;
  toTechnicianName: string;
  reassignedAt: string;
  reason: string;
  reassignedBy: string;
}

export interface StatusLog {
  status: ServiceStatus;
  timestamp: string;
  updatedBy: string;
  remarks?: string;
}

export interface CompletionReport {
  workPerformed: string;
  findingsAndRecommendations?: string;
  photos: ServicePhoto[];
  completedByTechId: string;
  completedByTechName: string;
  completedAt: string;
  confirmationChecked: boolean;
}

export interface ServiceJob {
  id: string;
  customerId: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  aircon: AirconUnit;
  complaint: string;
  serviceType: ServiceType;
  preferredDate?: string;
  adminRemarks?: string;
  assignedTechnicianId: string;
  assignedTechnicianName: string;
  originalTechnicianId: string;
  originalTechnicianName: string;
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  status: ServiceStatus;
  onHoldReason?: string;
  reassignments: ReassignmentRecord[];
  statusHistory: StatusLog[];
  completionReport?: CompletionReport;
}

export type AdminTab = 
  | 'dashboard' 
  | 'assignments' 
  | 'new-assignment' 
  | 'customers' 
  | 'technicians' 
  | 'service-history' 
  | 'reports' 
  | 'settings';
