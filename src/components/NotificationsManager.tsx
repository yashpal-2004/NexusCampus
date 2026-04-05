import React, { useState } from 'react';
import { useNotifications } from './NotificationsContext';
import NotificationsToast from './NotificationsToast';
import NotificationsDropdown from './NotificationsDropdown';
import NotificationsBadge from './NotificationsBadge';
import { Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const NotificationsManager: React.FC<{ onNavigateToAll: () => void }> = ({ onNavigateToAll }) => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Show toast for the latest unread notification if it's new
  React.useEffect(() => {
    const latest = notifications[0];
    if (latest && !latest.read) {
      setActiveToast(latest.id);
      const timer = setTimeout(() => setActiveToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <>
      {/* Global Notification Icon (Floating or in Header) */}
      <div className="fixed top-6 right-6 z-[60]">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xl"
          >
            <Bell className="w-6 h-6" />
            <NotificationsBadge count={unreadCount} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <NotificationsDropdown 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onClose={() => setIsDropdownOpen(false)}
                onViewAll={onNavigateToAll}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end space-y-4 pointer-events-none">
        <AnimatePresence>
          {activeToast && notifications.find(n => n.id === activeToast) && (
            <NotificationsToast 
              notification={notifications.find(n => n.id === activeToast)!}
              onClose={() => setActiveToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationsManager;
