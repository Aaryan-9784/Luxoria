import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Car, CheckCircle2, AlertCircle } from 'lucide-react';

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking for the Lamborghini Aventador SVJ has been confirmed.',
    time: '2 hours ago',
    read: false,
    icon: Car,
    color: 'text-[#C9A75D]',
    bg: 'bg-[#C9A75D]/10'
  },
  {
    id: 2,
    type: 'system',
    title: 'Welcome to Luxoria',
    message: 'Complete your profile to unlock exclusive member benefits and expedited booking.',
    time: '1 day ago',
    read: true,
    icon: Bell,
    color: 'text-[#0F0F0F]',
    bg: 'bg-[#F5F5F5] border border-[#ECECEC]'
  },
  {
    id: 3,
    type: 'success',
    title: 'Payment Successful',
    message: 'Your recent payment of $2,400 for booking #BK-8472 was successful.',
    time: '2 days ago',
    read: true,
    icon: CheckCircle2,
    color: 'text-[#16A34A]',
    bg: 'bg-[#16A34A]/10'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Driver License Expiring',
    message: 'The driver license on your profile will expire in 30 days. Please update it.',
    time: '1 week ago',
    read: true,
    icon: AlertCircle,
    color: 'text-[#DC2626]',
    bg: 'bg-[#DC2626]/10'
  }
];

export default function NotificationsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#0F0F0F] tracking-tight mb-2">Notifications</h1>
          <p className="text-[13px] text-[#666666] tracking-wide">Stay updated on your bookings and account activity.</p>
        </div>
        <button className="px-5 py-2.5 bg-white border border-[#ECECEC] text-[#0F0F0F] text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#F5F5F5] transition-colors shadow-sm whitespace-nowrap">
          Mark all as read
        </button>
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm overflow-hidden">
        {DUMMY_NOTIFICATIONS.length > 0 ? (
          <div className="divide-y divide-[#ECECEC]">
            {DUMMY_NOTIFICATIONS.map((notification) => {
              const Icon = notification.icon;
              return (
                <div 
                  key={notification.id} 
                  className={`p-6 flex items-start gap-5 transition-colors hover:bg-[#FBFBFB] ${
                    !notification.read ? "bg-[#FBFBFB]/50" : "bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notification.bg}`}>
                    <Icon className={`w-5 h-5 ${notification.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className={`text-[15px] font-bold ${!notification.read ? "text-[#0F0F0F]" : "text-[#0F0F0F]/80"}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider whitespace-nowrap ml-4">
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-[13px] leading-relaxed ${!notification.read ? "text-[#666666] font-medium" : "text-[#999999]"}`}>
                      {notification.message}
                    </p>
                  </div>
                  
                  {!notification.read && (
                    <div className="shrink-0 flex items-center justify-center pt-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C9A75D] shadow-[0_0_8px_rgba(201,167,93,0.5)]" />
                    </div>
                  )}
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
