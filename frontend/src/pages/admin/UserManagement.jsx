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
            className="input pl-9"
          />
        </div>
      </div>

      <div className="glass-card-elevated rounded-2xl overflow-hidden border border-border">
        {loading && users.length === 0 ? (
          <div className="p-10 text-center animate-pulse text-muted">Loading user database...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
                          {user.avatar?.url ? <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" /> : <span className="font-semibold text-primary">{user.name.charAt(0)}</span>}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-primary">{user.name}</p>
                          <p className="text-caption text-muted">{user._id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-body-sm text-primary">{user.email}</p>
                      <p className="text-caption text-muted">{user.phone || 'N/A'}</p>
                    </td>
                    <td>
                      <span className="text-body-sm text-secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      {user.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-error">Suspended</span>
                      )}
                    </td>
                    <td className="text-right">
                      <button 
                        onClick={() => toggleStatus(user._id, user.isActive)}
                        className={`btn btn-sm ${
                          user.isActive ? 'btn-ghost text-error hover:text-error' : 'btn-ghost text-success hover:text-success'
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
