import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LayoutGrid } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: any;
  sessions?: any[];
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, sessions = [], onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-ramos-black flex overflow-x-hidden font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-ramos-gray z-[60] flex items-center justify-between px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-ramos-red flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-ramos-black tracking-tighter">
            NexusCampus
          </h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full bg-ramos-gray text-ramos-black hover:bg-ramos-black hover:text-white transition-all"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {user && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }} 
          user={user} 
          sessions={sessions}
          onLogout={onLogout} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className={cn(
        "flex-1 min-h-screen relative overflow-x-hidden pt-20 lg:pt-0 transition-all duration-500",
        user ? "lg:ml-72" : "m-0 p-0"
      )}>
        {/* Subtle Background Detail */}
        <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-ramos-red/5 blur-[120px] rounded-full -z-10 pointer-events-none animate-float" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full h-full p-6 lg:p-12"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;

