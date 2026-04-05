import React from 'react';
import { 
  Home, 
  Search, 
  User, 
  MessageSquare, 
  Users, 
  Stethoscope, 
  LifeBuoy, 
  Shirt, 
  Utensils, 
  Bell, 
  LogOut,
  Shield,
  X,
  MessageCircle,
  Hexagon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: any;
  sessions?: any[];
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, sessions = [], onLogout, isOpen, onClose }) => {
  const isAdmin = user?.email === 'yashpal.2024@nst.rishihood.edu.in';
  
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'my-queries', icon: MessageSquare, label: 'My Queries' },
    ...(sessions.filter(s => s.participants.includes(user?.uid)).length > 0 
      ? [{ id: 'messages', icon: MessageCircle, label: 'Messages' }] 
      : []),
    { id: 'find-buddy', icon: Users, label: 'Find a Buddy' },
    { id: 'medical', icon: Stethoscope, label: 'Medical' },
    { id: 'support', icon: LifeBuoy, label: 'Support' },
    { id: 'laundry', icon: Shirt, label: 'Laundry' },
    { id: 'food-court', icon: Utensils, label: 'Food Court' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
    ...(isAdmin ? [{ id: 'admin', icon: Shield, label: 'Admin Panel' }] : []),
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "h-screen w-72 bg-white border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0 z-50 transition-all duration-500 ease-out shadow-xl",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Hexagon className="w-6 h-6 text-white fill-current" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              Nexus<span className="text-orange-500">Campus</span>
            </h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                "w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-orange-50 text-orange-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-orange-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                activeTab === item.id ? "text-orange-600" : ""
              )} />
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {user && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center space-x-4 px-4 py-4 mb-4 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-md">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xl">{user.displayName?.[0] || 'U'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{user.displayName}</p>
                <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-widest">ID: {user.uid.slice(0, 8)}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold text-xs uppercase tracking-widest">Logout Session</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
