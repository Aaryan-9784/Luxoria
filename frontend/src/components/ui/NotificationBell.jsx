import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/redux/slices/notificationSlice';
import { Bell, Check, Info, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getNotificationsPath = () => {
    if (user?.role === 'admin') return '/admin/notifications';
    if (user?.role === 'vendor') return '/vendor/notifications';
    return '/notifications';
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getIcon = (type) => {
    switch(type) {
      case 'system': return <Info className="w-5 h-5 text-accent" />;
      case 'approval': return <ShieldCheck className="w-5 h-5 text-primary" />;
      case 'booking': return <Check className="w-5 h-5 text-success" />;
      case 'payment': return <AlertTriangle className="w-5 h-5 text-error" />;
      default: return <Bell className="w-5 h-5 text-muted" />;
    }
  };

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    dispatch(markAsRead(id));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#666666] hover:text-[#0F0F0F] transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent border-2 border-white"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-50 origin-top-right"
          >
            <div className="flex justify-between items-center p-4 border-b border-border bg-surface/30">
              <h3 className="font-semibold text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => dispatch(markAllAsRead())}
                  className="text-xs font-semibold text-accent hover:text-primary transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-secondary">
                  <Bell className="w-8 h-8 mx-auto mb-3 text-muted" />
                  <p className="text-sm">You have no notifications.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`p-4 hover:bg-surface/50 transition-colors flex gap-4 group ${!notif.isRead ? 'bg-surface/30' : ''}`}
                    >
                      <div className="mt-1 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-primary' : 'font-medium text-secondary'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-muted whitespace-nowrap ml-2">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-xs ${!notif.isRead ? 'text-secondary font-medium' : 'text-muted'}`}>
                          {notif.message}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-center gap-1 mt-1">
                        {!notif.isRead && (
                          <button 
                            onClick={(e) => handleMarkAsRead(e, notif._id)}
                            className="text-accent/50 hover:text-accent transition-colors"
                            title="Mark as read"
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notif._id)}
                          className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all p-0.5 rounded"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-border bg-surface/30">
              <Link 
                to={getNotificationsPath()} 
                onClick={() => setIsOpen(false)}
                className="block w-full py-2 text-center text-sm font-semibold text-primary hover:bg-surface/50 rounded-lg transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
