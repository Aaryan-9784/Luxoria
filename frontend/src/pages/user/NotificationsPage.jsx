import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Car, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllAsRead, markAsRead, deleteNotification, deleteAllNotifications } from '../../redux/slices/notificationSlice';

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} years ago`;
};

const getNotificationStyle = (type) => {
  switch (type) {
    case 'booking':
      return { icon: Car, color: 'text-[#C9A75D]', bg: 'bg-[#C9A75D]/10' };
    case 'payment':
      return { icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#16A34A]/10' };
    case 'approval':
    case 'system':
      return { icon: Bell, color: 'text-[#0F0F0F]', bg: 'bg-[#F5F5F5] border border-[#ECECEC]' };
    case 'review':
    case 'alert':
      return { icon: AlertCircle, color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/10' };
    default:
      return { icon: Bell, color: 'text-[#0F0F0F]', bg: 'bg-[#F5F5F5] border border-[#ECECEC]' };
  }
};

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchNotifications());
  }, [dispatch, accessToken]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkAsRead = (id, isRead) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleDeleteAll = () => {
    dispatch(deleteAllNotifications());
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Notifications</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Stay updated on your bookings and account activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllAsRead}
            className="px-5 py-2.5 bg-white border border-[#ECECEC] text-[#0F0F0F] text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#F5F5F5] transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            Mark all as read
          </button>
          <button 
            onClick={handleDeleteAll}
            className="px-5 py-2.5 bg-white border border-[#ECECEC] text-[#DC2626] text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#FEF2F2] transition-colors shadow-sm whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete all
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-8 h-8 border-4 border-[#C9A75D] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[13px] text-[#666666]">Loading notifications...</p>
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="divide-y divide-[#ECECEC]">
            {notifications.map((notification) => {
              const { icon: Icon, color, bg } = getNotificationStyle(notification.type);
              const isRead = notification.isRead;
              return (
                <div 
                  key={notification._id} 
                  onClick={() => handleMarkAsRead(notification._id, isRead)}
                  className={`p-6 flex items-start gap-5 transition-colors hover:bg-[#FBFBFB] cursor-pointer group ${
                    !isRead ? "bg-[#FBFBFB]/50" : "bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className={`text-[15px] font-bold ${!isRead ? "text-[#0F0F0F]" : "text-[#0F0F0F]/80"}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider whitespace-nowrap ml-4">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[13px] leading-relaxed ${!isRead ? "text-[#666666] font-medium" : "text-[#999999]"}`}>
                      {notification.message}
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-2 pt-1">
                    {!isRead && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C9A75D] shadow-[0_0_8px_rgba(201,167,93,0.5)]" />
                    )}
                    <button
                      onClick={(e) => handleDelete(e, notification._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#999999] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
              <Bell className="w-8 h-8 text-[#C9A75D] opacity-60" />
            </div>
            <h3 className="text-xl font-serif text-[#0F0F0F] mb-2">No notifications yet</h3>
            <p className="text-[13px] text-[#666666]">When you get notifications, they'll show up here.</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}
