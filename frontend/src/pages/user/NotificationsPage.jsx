import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Car, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking for the Lamborghini Aventador SVJ has been confirmed.',
    time: '2 hours ago',
    read: false,
    icon: Car,
    color: 'text-accent',
    bg: 'bg-accent/15'
  },
  {
    id: 2,
    type: 'system',
    title: 'Welcome to Luxoria',
    message: 'Complete your profile to unlock exclusive member benefits and expedited booking.',
    time: '1 day ago',
    read: true,
    icon: Bell,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    id: 3,
    type: 'success',
    title: 'Payment Successful',
    message: 'Your recent payment of $2,400 for booking #BK-8472 was successful.',
    time: '2 days ago',
    read: true,
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Driver License Expiring',
    message: 'The driver license on your profile will expire in 30 days. Please update it.',
    time: '1 week ago',
    read: true,
    icon: AlertCircle,
    color: 'text-error',
    bg: 'bg-error/10'
  }
];

export default function NotificationsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-h3 text-primary mb-1">Notifications</h1>
          <p className="text-secondary">Stay updated on your bookings and account activity</p>
        </div>
        <button className="btn btn-outline btn-sm">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {DUMMY_NOTIFICATIONS.length > 0 ? (
          <div className="divide-y divide-border">
            {DUMMY_NOTIFICATIONS.map((notification) => {
              const Icon = notification.icon;
              return (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-5 flex gap-4 transition-colors hover:bg-surface/50",
                    !notification.read && "bg-surface/30"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", notification.bg)}>
                    <Icon className={cn("w-6 h-6", notification.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("text-body font-semibold", !notification.read ? "text-primary" : "text-secondary")}>
                        {notification.title}
                      </h4>
                      <span className="text-caption text-muted whitespace-nowrap ml-4">
                        {notification.time}
                      </span>
                    </div>
                    <p className={cn("text-body-sm", !notification.read ? "text-secondary font-medium" : "text-muted")}>
                      {notification.message}
                    </p>
                  </div>
                  
                  {!notification.read && (
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-h6 text-primary mb-2">No notifications yet</h3>
            <p className="text-secondary">When you get notifications, they'll show up here.</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}
