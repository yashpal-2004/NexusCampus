import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Check, 
  Trash2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onMarkAsRead, onClearAll }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'query': return <MessageSquare className="w-5 h-5" />;
      case 'blinkit': return <ShoppingBag className="w-5 h-5" />;
      case 'buddy': return <Users className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'query': return 'text-blue-400 bg-blue-400/10';
      case 'blinkit': return 'text-yellow-500 bg-yellow-500/10';
      case 'buddy': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-purple-400 bg-purple-400/10';
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-24 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Notifications</h2>
          <p className="text-white/40 text-sm font-medium">Stay updated with your campus activity.</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all text-xs font-black"
          >
            <Trash2 className="w-4 h-4" />
            <span>CLEAR ALL</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-20"
            >
              <Bell className="w-16 h-16" />
              <p className="text-lg font-bold">No notifications yet</p>
            </motion.div>
          ) : (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "relative group bg-white/5 border border-white/10 rounded-[32px] p-6 transition-all hover:bg-white/[0.08]",
                  !notif.read && "border-orange-500/30 bg-orange-500/[0.02]"
                )}
              >
                {!notif.read && (
                  <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={cn("p-4 rounded-2xl flex-shrink-0", getColor(notif.type))}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "font-black text-lg tracking-tight",
                        notif.read ? "text-white/60" : "text-white"
                      )}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-bold text-white/20 uppercase flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(notif.createdAt)} ago</span>
                      </span>
                    </div>
                    
                    <p className={cn(
                      "text-sm leading-relaxed mb-4",
                      notif.read ? "text-white/30" : "text-white/60"
                    )}>
                      {notif.message}
                    </p>
                    
                    {!notif.read && (
                      <button 
                        onClick={() => onMarkAsRead(notif.id)}
                        className="flex items-center space-x-2 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark as read</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 0 && (
        <div className="mt-10 flex items-center justify-center space-x-2 text-white/20">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">End of notifications</span>
        </div>
      )}
    </div>
  );
};

export default Notifications;
