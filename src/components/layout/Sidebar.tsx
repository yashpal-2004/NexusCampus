import React from 'react';
import { 
  Home, 
  User, 
  Users, 
  LifeBuoy, 
  Shirt, 
  Utensils, 
  Shield,
  X,
  MessageCircle,
  LayoutGrid,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

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
    { id: 'my-activity', icon: Activity, label: 'My Activity' },
    ...(sessions.filter(s => s.participants?.includes(user?.uid)).length > 0 
      ? [{ id: 'messages', icon: MessageCircle, label: 'Messages' }] 
      : []),
    { id: 'find-buddy', icon: Users, label: 'Buddy Finder' },
    { id: 'wellness', icon: Activity, label: 'Wellness' },
    { id: 'support', icon: LifeBuoy, label: 'Support' },
    { id: 'laundry', icon: Shirt, label: 'Laundry' },
    { id: 'food-court', icon: Utensils, label: 'Food Court' },
    { id: 'profile', icon: User, label: 'Profile' },
    ...(isAdmin ? [{ id: 'admin', icon: Shield, label: 'Admin' }] : []),
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
            className="fixed inset-0 bg-ramos-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "h-screen w-72 bg-white border-r border-ramos-gray flex flex-col p-8 fixed left-0 top-0 z-[70] transition-all duration-500 ease-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-3">
            <Logo size={40} className="animate-float" />
            <h1 className="text-2xl font-bold text-ramos-black tracking-tighter">
              NexusCampus
            </h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-full bg-ramos-gray text-ramos-black/40 hover:text-ramos-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                "w-full flex items-center space-x-4 px-6 py-4 rounded-[24px] transition-all duration-300 group relative",
                activeTab === item.id 
                  ? "bg-ramos-black text-white shadow-xl shadow-ramos-black/10 scale-[1.02]" 
                  : "text-ramos-black/40 hover:text-ramos-black hover:bg-ramos-gray"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                activeTab === item.id ? "text-ramos-red" : ""
              )} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {user && (
          <div className="mt-8 pt-8 border-t border-ramos-gray">
            <div className="flex items-center space-x-4 px-2">
              <div className="w-12 h-12 rounded-full border-2 border-ramos-gray bg-ramos-black/5 overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-ramos-black/40">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ramos-black truncate">{user.displayName}</p>
                <p className="text-[11px] font-medium text-ramos-black/30 truncate">Verified Student</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;

