/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { adminService } from '@/services/adminService';
import { User } from '@/types/indexes';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FaToggleOn, FaToggleOff, FaUserPlus } from 'react-icons/fa';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

const loadUsers = async () => {
  try {
    const response = await adminService.getAllUsers();
    setUsers(response.data.items); // Change from .users to .items
  } catch (error) {
    console.error('Failed to load users:', error);
    toast.error('Failed to load users');
  } finally {
    setLoading(false);
  }
};

  const handleToggleStatus = async (id: string) => {
    try {
      await adminService.toggleUserStatus(id);
      toast.success('User status updated');
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="superadmin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-stone-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="superadmin">
      <div className="space-y-6 bg-stone-50 min-h-screen ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">User Management</h1>
            <p className="text-stone-600 mt-2 text-lg">Manage all system users</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-green-900 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <FaUserPlus /> Create Admin
          </button>
        </div>

        <div className="bg-white rounded-sm border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge isActive={user.isActive} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role !== 'superadmin' && (
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="p-2 text-green-700 hover:bg-green-50 rounded transition-colors"
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
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

      {showCreateModal && (
        <CreateAdminModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadUsers();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors = {
    superadmin: 'bg-red-50 text-red-800 border border-red-200',
    admin: 'bg-emerald-900/5 text-green-700 border border-emerald-900/10',
    volunteer: 'bg-amber-50 text-amber-800 border border-amber-200',
  };
  return (
    <span className={`px-3 py-1.5 rounded text-xs font-medium ${colors[role as keyof typeof colors]}`}>
      {role}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`px-3 py-1.5 rounded text-xs font-medium ${
        isActive 
          ? 'bg-emerald-900/5 text-green-700 border border-emerald-900/10' 
          : 'bg-stone-100 text-stone-600 border border-stone-200'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function CreateAdminModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.createAdmin(formData);
      toast.success('Admin created successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl max-w-md w-full border border-stone-200">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Create Admin User</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all text-stone-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all text-stone-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all text-stone-900"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all text-stone-900"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 bg-stone-100 text-stone-800 rounded font-medium hover:bg-stone-200 transition-colors border border-stone-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-green-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}