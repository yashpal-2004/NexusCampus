import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  X 
} from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationsToast: React.FC<NotificationsToastProps> = ({ notification, onClose }) => {
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
      case 'query': return 'text-blue-600 bg-blue-50';
      case 'blinkit': return 'text-yellow-600 bg-yellow-50';
      case 'buddy': return 'text-orange-600 bg-orange-50';
      default: return 'text-purple-600 bg-purple-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="bg-white border border-slate-200 rounded-[32px] p-5 shadow-2xl shadow-slate-200/50 flex items-start space-x-4 min-w-[320px] max-w-md pointer-events-auto"
    >
      <div className={cn("p-3 rounded-2xl flex-shrink-0", getColor(notification.type))}>
        {getIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="font-black text-slate-900 text-sm tracking-tight mb-1">{notification.title}</h4>
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{notification.message}</p>
      </div>

      <button 
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default NotificationsToast;
