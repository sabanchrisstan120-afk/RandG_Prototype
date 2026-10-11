import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AirconType, ServiceType } from '../../types';
import { 
  User, 
  MapPin, 
  Phone, 
  CheckCircle
} from 'lucide-react';

interface NewAssignmentFormProps {
  onSuccess?: (newJobId: string) => void;
  onCancel?: () => void;
}

const COMMON_COMPLAINTS: Record<ServiceType, string[]> = {
  Repair: [
    'Aircon not cooling, compressor shuts off after several minutes',
    'Indoor blower makes loud rattling / vibration noise',
    'Water leaking heavily from bottom casing onto room furniture',
    'Unit powers on but error code blinking on display panel',
    'Foul burning smell observed coming from electrical terminal'
  ],
  Cleaning: [
    'Musty sour smell when aircon runs, airflow feels significantly restricted',
    'Quarterly preventive hydro-wash and chemical fin sanitization',
    'Blower wheel clogged with black dust and slime buildup',
    'Outdoor condenser coil covered in dirt causing high power consumption'
  ],
  Installation: [
    'Full installation of brand new split-type inverter unit purchased by client',
    'Relocation of existing window unit to another bedroom including wall framing',
    'Ceiling-mounted cassette installation with extended 10-meter copper piping'
  ],
  Maintenance: [
    'Comprehensive 12-point preventive maintenance and electrical diagnostic check',
    'Refrigerant operating pressure test and electrical amperage draw inspection'
  ],
  Inspection: [
    'Pre-summer site inspection and assessment of cooling efficiency for multi-unit home',
    'Diagnostic inspection for high electricity bill suspected caused by inverter leak'
  ],
  Other: [
    'Dismantling of defective unit and disposal assistance',
    'Remote control replacement and PCB sensor board testing'
  ]
};

export const NewAssignmentForm: React.FC<NewAssignmentFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { customers, technicians, createJob, setAdminTab } = useApp();

  // Existing customer selection vs new
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Aircon info
  const [airconBrand, setAirconBrand] = useState('Carrier');
  const [airconType, setAirconType] = useState<AirconType>('Split-Type');
  const [capacityHp, setCapacityHp] = useState('1.5 HP');
  const [airconDetails, setAirconDetails] = useState('');

  // Service Request
  const [serviceType, setServiceType] = useState<ServiceType>('Repair');
  const [complaint, setComplaint] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Technician & Admin Remarks
  const [assignedTechnicianId, setAssignedTechnicianId] = useState<string>(() => {
    return technicians.length > 0 ? technicians[0].id : '';
  });
  const [adminRemarks, setAdminRemarks] = useState('');

  // Form error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // When selecting existing customer from autocomplete
  const handleSelectExistingCustomer = (custId: string) => {
    setSelectedCustomerId(custId);
    if (!custId) {
      setCustomerName('');
      setCustomerContact('');
      setCustomerAddress('');
      return;
    }
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setCustomerContact(found.contactNumber);
      setCustomerAddress(found.address);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Customer Name is required.';
    if (!customerContact.trim()) errs.customerContact = 'Contact Number is required.';
    if (!customerAddress.trim()) errs.customerAddress = 'Complete Service Address is required.';
    if (!complaint.trim()) errs.complaint = 'Customer Complaint is required.';
    if (!assignedTechnicianId) errs.assignedTechnicianId = 'Please select a technician.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newJob = createJob({
      customerId: selectedCustomerId || undefined,
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      customerAddress: customerAddress.trim(),
      aircon: {
        brand: airconBrand.trim() || 'Other',
        type: airconType,
        capacityHp: capacityHp.trim() || undefined,
        details: airconDetails.trim() || undefined
      },
      complaint: complaint.trim(),
      serviceType,
      preferredDate,
      adminRemarks: adminRemarks.trim(),
      technicianId: assignedTechnicianId
    });

    if (onSuccess) {
      onSuccess(newJob.id);
    } else {
      setAdminTab('assignments');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Create New Service Assignment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dispatch a field technician for aircon repair, cleaning, or installation.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel || (() => setAdminTab('assignments'))}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Customer Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Customer Information
              </h2>
            </div>

            {/* Quick autocomplete from existing clients */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Existing client:</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleSelectExistingCustomer(e.target.value)}
                className="text-xs py-1 px-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:ring-1 focus:ring-[#2EC4B6]"
              >
                <option value="">-- Choose Existing Client --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.contactNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                  }}
                  placeholder="e.g. Juan Dela Cruz"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                    errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]`}
                />
              </div>
              {errors.customerName && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerContact}
                  onChange={(e) => {
                    setCustomerContact(e.target.value);
                    if (errors.customerContact) setErrors((prev) => ({ ...prev, customerContact: '' }));
                  }}
                  placeholder="e.g. 0917-812-4902"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                    errors.customerContact ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]`}
                />
              </div>
              {errors.customerContact && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.customerContact}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Complete Service Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => {
                    setCustomerAddress(e.target.value);
                    if (errors.customerAddress) setErrors((prev) => ({ ...prev, customerAddress: '' }));
                  }}
                  placeholder="e.g. Unit 1402, Renaissance Tower 2000, Meralco Ave, Pasig City"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                    errors.customerAddress ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]`}
                />
              </div>
              {errors.customerAddress && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.customerAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Aircon Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#2EC4B6] flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Aircon Unit Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Brand
              </label>
              <input
                type="text"
                value={airconBrand}
                onChange={(e) => setAirconBrand(e.target.value)}
                placeholder="e.g. Carrier, Daikin, Panasonic"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={airconType}
                onChange={(e) => setAirconType(e.target.value as AirconType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              >
                <option value="Split-Type">Split-Type</option>
                <option value="Window">Window Type</option>
                <option value="Inverter">Inverter</option>
                <option value="Floor Mounted">Floor Mounted</option>
                <option value="Cassette">Cassette</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Capacity / HP <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={capacityHp}
                onChange={(e) => setCapacityHp(e.target.value)}
                placeholder="e.g. 1.0 HP, 1.5 HP, 2.0 HP"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Additional Aircon Details <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={airconDetails}
                onChange={(e) => setAirconDetails(e.target.value)}
                placeholder="e.g. Living Room unit, Model FP-53CVS012, Outdoor unit located on fire escape balcony"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Service Request Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Service Request Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Service Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              >
                <option value="Repair">Repair (Troubleshooting & Part Replacement)</option>
                <option value="Cleaning">Cleaning (Deep Hydro-Wash & Sanitization)</option>
                <option value="Installation">Installation (Unit Mounting & Piping)</option>
                <option value="Maintenance">Maintenance (12-Point Inspection)</option>
                <option value="Inspection">Inspection (Diagnostic Assessment)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Service Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Complaint / Symptom <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={complaint}
                onChange={(e) => {
                  setComplaint(e.target.value);
                  if (errors.complaint) setErrors((prev) => ({ ...prev, complaint: '' }));
                }}
                placeholder="Describe the issue reported by the customer (e.g. Not cooling, loud vibrating noise, water leaking)..."
                className={`w-full p-3 text-xs rounded-xl border ${
                  errors.complaint ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]`}
              />
              {errors.complaint && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.complaint}</p>
              )}

              {/* Quick Preset Complaint Chips */}
              <div className="mt-2">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                  Quick complaint presets for {serviceType}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_COMPLAINTS[serviceType]?.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setComplaint(c)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md transition-colors"
                    >
                      + {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Technician Assignment & Admin Instructions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Technician Assignment & Admin Remarks
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Technician <span className="text-rose-500">*</span>
              </label>
              <select
                value={assignedTechnicianId}
                onChange={(e) => setAssignedTechnicianId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              >
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id} disabled={!tech.active}>
                    {tech.name} — {tech.specialty} {!tech.active ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Selected technician will see this work order immediately in their mobile job list.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Remarks / Special Instructions <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="e.g. Bring 35uF dual capacitor; security gate pass arranged with building administration; test vacuum down to 500 microns."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel || (() => setAdminTab('assignments'))}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#0A2342] hover:bg-[#12335C] text-white shadow-md transition-colors cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 text-[#2EC4B6]" />
            <span>Save Assignment & Dispatch</span>
          </button>
        </div>
      </form>
    </div>
  );
};
