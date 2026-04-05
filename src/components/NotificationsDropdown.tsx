import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
  onViewAll: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onClose,
  onViewAll
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'query': return <MessageSquare className="w-4 h-4" />;
      case 'blinkit': return <ShoppingBag className="w-4 h-4" />;
      case 'buddy': return <Users className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'query': return 'text-blue-600 bg-blue-50';
      case 'blinkit': return 'text-yellow-600 bg-yellow-50';
      case 'buddy': return 'text-orange-600 bg-orange-50';
      default: return 'text-purple-600 bg-purple-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="absolute right-0 top-full mt-4 w-96 bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden z-[100]"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="font-black text-slate-900 tracking-tight">Notifications</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto no-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-12 text-center space-y-4 opacity-20 text-slate-400">
            <Bell className="w-12 h-12 mx-auto" />
            <p className="text-sm font-bold">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                className={cn(
                  "p-5 flex items-start space-x-4 cursor-pointer transition-colors",
                  !notif.read && "bg-orange-50/30"
                )}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  onClose();
                }}
              >
                <div className={cn("p-3 rounded-xl flex-shrink-0", getColor(notif.type))}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={cn(
                      "font-bold text-sm truncate pr-2",
                      notif.read ? "text-slate-400" : "text-slate-900"
                    )}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">
                      {formatDistanceToNow(notif.createdAt)}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs leading-relaxed line-clamp-2",
                    notif.read ? "text-slate-400" : "text-slate-600"
                  )}>
                    {notif.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onViewAll}
        className="w-full p-5 bg-slate-50/50 border-t border-slate-100 text-center text-xs font-black text-orange-600 hover:text-orange-700 hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
      >
        <span>VIEW ALL NOTIFICATIONS</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default NotificationsDropdown;
