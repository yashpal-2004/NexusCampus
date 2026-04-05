import React from 'react';
import { 
  Bell, 
  Settings, 
  Dumbbell, 
  Utensils, 
  Shirt, 
  Shield, 
  CheckCircle2, 
  Trash2,
  Sparkles,
  MessageSquare,
  ShoppingBag,
  Users
} from 'lucide-react';
import { Notification, UserProfile } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsPageProps {
  notifications: Notification[];
  user: UserProfile;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onUpdateSubscription: (key: keyof UserProfile['subscriptions'], value: boolean) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ 
  notifications, 
  user, 
  onMarkAsRead, 
  onClearAll,
  onUpdateSubscription
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'query': return <MessageSquare className="w-5 h-5" />;
      case 'blinkit': return <ShoppingBag className="w-5 h-5" />;
      case 'buddy': return <Users className="w-5 h-5" />;
      case 'upvote': return <Sparkles className="w-5 h-5" />;
      case 'reply': return <MessageSquare className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'query': return 'text-blue-400 bg-blue-400/10';
      case 'blinkit': return 'text-yellow-500 bg-yellow-500/10';
      case 'buddy': return 'text-orange-500 bg-orange-500/10';
      case 'upvote': return 'text-pink-500 bg-pink-500/10';
      case 'reply': return 'text-indigo-400 bg-indigo-400/10';
      default: return 'text-purple-400 bg-purple-400/10';
    }
  };

  const subscriptions = [
    { id: 'gym', icon: Dumbbell, label: 'Gym Updates', color: 'text-orange-600' },
    { id: 'foodCourt', icon: Utensils, label: 'Food Court Menu', color: 'text-yellow-600' },
    { id: 'laundry', icon: Shirt, label: 'Laundry Availability', color: 'text-blue-600' },
    { id: 'system', icon: Shield, label: 'System Alerts', color: 'text-purple-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">Notifications</h2>
          <p className="text-slate-500 text-sm font-medium">Stay updated with everything happening on campus.</p>
        </div>
        
        <button 
          onClick={onClearAll}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-xs hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>CLEAR ALL</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-20 text-center space-y-4 opacity-20 border border-dashed border-slate-200 rounded-[40px]"
              >
                <Bell className="w-16 h-16 mx-auto text-slate-400" />
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400">No notifications yet</p>
              </motion.div>
            ) : (
              notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "p-6 rounded-[32px] border transition-all flex items-start space-x-6",
                    notif.read 
                      ? "bg-slate-50 border-slate-100 opacity-60" 
                      : "bg-white border-slate-200 shadow-xl shadow-slate-200/20"
                  )}
                >
                  <div className={cn("p-4 rounded-2xl flex-shrink-0", getColor(notif.type))}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={cn(
                        "font-black text-lg tracking-tight",
                        notif.read ? "text-slate-400" : "text-slate-900"
                      )}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {formatDistanceToNow(notif.createdAt)} ago
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm leading-relaxed mb-4",
                      notif.read ? "text-slate-400" : "text-slate-600"
                    )}>
                      {notif.message}
                    </p>
                    
                    {!notif.read && (
                      <button 
                        onClick={() => onMarkAsRead(notif.id)}
                        className="flex items-center space-x-2 text-[10px] font-black text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-widest"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark as read</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Subscription Settings */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-2xl shadow-slate-200/20">
            <div className="flex items-center space-x-3 mb-8">
              <Settings className="w-6 h-6 text-slate-400" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Subscriptions</h3>
            </div>
            
            <div className="space-y-6">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={cn("p-3 rounded-xl bg-slate-50", sub.color)}>
                      <sub.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 tracking-tight">{sub.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Real-time alerts</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onUpdateSubscription(sub.id as any, !user.subscriptions?.[sub.id as keyof UserProfile['subscriptions']])}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-all duration-300",
                      user.subscriptions?.[sub.id as keyof UserProfile['subscriptions']] ? "bg-orange-600" : "bg-slate-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: user.subscriptions?.[sub.id as keyof UserProfile['subscriptions']] ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                You will receive push notifications and in-app alerts for your subscribed categories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
