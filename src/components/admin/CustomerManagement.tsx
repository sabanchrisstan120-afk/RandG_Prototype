import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Customer, ServiceJob } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  History, 
  Edit
} from 'lucide-react';

interface CustomerManagementProps {
  onViewJob: (job: ServiceJob) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ onViewJob }) => {
  const { customers, addCustomer, updateCustomer, getCustomerJobs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<Customer | null>(null);

  // Add / Edit Modal state
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.contactNumber.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormContact('');
    setFormAddress('');
    setFormEmail('');
    setFormNotes('');
    setCustomerModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormName(customer.name);
    setFormContact(customer.contactNumber);
    setFormAddress(customer.address);
    setFormEmail(customer.email || '');
    setFormNotes(customer.notes || '');
    setCustomerModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContact.trim() || !formAddress.trim()) return;

    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        name: formName.trim(),
        contactNumber: formContact.trim(),
        address: formAddress.trim(),
        email: formEmail.trim() || undefined,
        notes: formNotes.trim() || undefined
      });
    } else {
      addCustomer({
        name: formName.trim(),
        contactNumber: formContact.trim(),
        address: formAddress.trim(),
        email: formEmail.trim() || undefined,
        notes: formNotes.trim() || undefined
      });
    }

    setCustomerModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Customer Directory & History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage client profiles, residential/commercial addresses, and access full service work-order history
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0A2342] hover:bg-[#12335C] text-white shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#2EC4B6]" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone number, or village/street address..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const customerJobs = getCustomerJobs(customer.id);
          const activeCount = customerJobs.filter((j) => ['Assigned', 'In Progress', 'On Hold'].includes(j.status)).length;

          return (
            <div
              key={customer.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {customer.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {customer.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(customer)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit Customer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${customer.contactNumber}`} className="text-blue-600 hover:underline font-mono">
                      {customer.contactNumber}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{customer.address}</span>
                  </div>
                </div>

                {customer.notes && (
                  <p className="mt-2.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                    "{customer.notes}"
                  </p>
                )}
              </div>

              {/* Service Job Stats & Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                    {customerJobs.length} {customerJobs.length === 1 ? 'Job' : 'Jobs'}
                  </span>
                  {activeCount > 0 && (
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                      {activeCount} Active
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCustomerHistory(customer)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0A2342] hover:text-[#2EC4B6] transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Service History ({customerJobs.length})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Service History Modal */}
      {selectedCustomerHistory && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCustomerHistory(null)}
          title={`Service History: ${selectedCustomerHistory.name}`}
          subtitle={`${selectedCustomerHistory.contactNumber} • ${selectedCustomerHistory.address}`}
          maxWidth="3xl"
        >
          {(() => {
            const customerJobs = getCustomerJobs(selectedCustomerHistory.id);
            return (
              <div className="space-y-4">
                {customerJobs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
                    No service assignments recorded yet for this customer.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Job ID</th>
                          <th className="py-2.5 px-3">Service Type</th>
                          <th className="py-2.5 px-3">Unit</th>
                          <th className="py-2.5 px-3">Assigned Tech</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customerJobs.map((j) => (
                          <tr key={j.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-3 font-mono font-bold text-[#0A2342]">
                              {j.id}
                            </td>
                            <td className="py-3 px-3 font-medium text-slate-800">
                              {j.serviceType}
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              {j.aircon.brand} {j.aircon.capacityHp || ''}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-semibold text-slate-800">{j.assignedTechnicianName}</span>
                              {j.completionReport && j.completionReport.completedByTechName !== j.assignedTechnicianName && (
                                <span className="block text-[10px] text-emerald-700">
                                  Done by: {j.completionReport.completedByTechName}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <StatusBadge status={j.status} size="sm" />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomerHistory(null);
                                  onViewJob(j);
                                }}
                                className="text-xs font-bold text-[#0A2342] hover:text-[#2EC4B6] transition-colors"
                              >
                                View Record →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    Total Lifetime Work Orders: {customerJobs.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomerHistory(null)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#0A2342] hover:bg-[#12335C] rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title={editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}
        subtitle={editingCustomer ? `Updating ${editingCustomer.id}` : 'Add a new client to R&G Aircon directory'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Maria Clara Santos"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formContact}
              onChange={(e) => setFormContact(e.target.value)}
              placeholder="e.g. 0918-223-4567"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Complete Service Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="e.g. 45 Acacia St., Valle Verde 3, Pasig City"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. maria.santos@gmail.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notes / Building Access Details <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Gate pass required at guard house; dog on premises."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCustomerModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#0A2342] hover:bg-[#12335C] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingCustomer ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
