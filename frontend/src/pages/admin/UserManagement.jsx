import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserStatus } from '@/redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { Search, Shield, Ban, CheckCircle, MoreVertical } from 'lucide-react';

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, loading, totalUsers } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchUsers('?role=user'));
  }, [dispatch]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = async (id, currentStatus) => {
    await dispatch(updateUserStatus({ id, isActive: !currentStatus }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-h3 text-primary mb-1">User Management</h1>
          <p className="text-secondary text-sm">Managing {totalUsers} registered customers.</p>
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2 text-body-sm outline-none focus:border-accent shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading && users.length === 0 ? (
          <div className="p-10 text-center animate-pulse text-muted">Loading user database...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
                          {user.avatar?.url ? <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" /> : <span className="font-semibold text-primary">{user.name.charAt(0)}</span>}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">{user.name}</p>
                          <p className="text-xs text-muted">{user._id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-primary">{user.email}</p>
                      <p className="text-xs text-muted">{user.phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-error/10 text-error">Suspended</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleStatus(user._id, user.isActive)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                          user.isActive ? 'text-error hover:bg-error/10' : 'text-success hover:bg-success/10'
                        }`}
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
