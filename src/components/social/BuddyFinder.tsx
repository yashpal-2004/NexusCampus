import React, { useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  Coffee, 
  Car, 
  Palmtree, 
  Plus, 
  Search, 
  MessageCircle, 
  MapPin,
  Calendar,
  Timer,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Clock
} from 'lucide-react';
import { BuddyPost, UserProfile } from '../../types';
import { cn, ensureMillis } from '../../lib/utils';
import BuddyCard from './BuddyCard';
import { motion, AnimatePresence } from 'motion/react';

interface BuddyFinderProps {
  posts: BuddyPost[];
  onPostBuddy: (category: BuddyPost['category'], title: string, description: string, window: number, allowDMs: boolean, location: string, date: string) => void;
  onConnect: (id: string) => void;
  onLeaveBuddy: (id: string) => void;
  onSendMessage: (id: string, content: string) => void;
  onDeleteBuddy: (id: string) => void;
  onExtendBuddy: (id: string, mins: number) => void;
  onCloseBuddy: (id: string) => void;
  onUpdateBuddy: (id: string, updates: Partial<BuddyPost>) => void;
  currentUserId?: string;
  allUsers: UserProfile[];
}

import { format } from 'date-fns';

const BuddyFinder: React.FC<BuddyFinderProps> = ({ 
  posts, 
  onPostBuddy, 
  onConnect,
  onLeaveBuddy,
  onSendMessage,
  onDeleteBuddy,
  onExtendBuddy,
  onCloseBuddy,
  onUpdateBuddy,
  currentUserId,
  allUsers
}) => {
  const [activeCategory, setActiveCategory] = useState<BuddyPost['category'] | 'all'>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<BuddyPost['category']>('gym');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState(format(new Date(), "d MMM"));
  const [newWindow, setNewWindow] = useState(15);
  const [allowDMs, setAllowDMs] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  React.useEffect(() => {
    const category = categories.find(c => c.id === newCat);
    if (category && category.id !== 'all') {
      const defaultTitle = `Buddy for ${category.label}`;
      const defaultDesc = `Looking for someone to join me for ${category.label.toLowerCase()}! Let's connect.`;
      
      // Only set if current values are empty or previously set defaults
      if (!newTitle || newTitle.startsWith('Buddy for ')) {
        setNewTitle(defaultTitle);
      }
      if (!newDesc || (newDesc.startsWith('Looking for someone to join me for ') && newDesc.endsWith("! Let's connect."))) {
        setNewDesc(defaultDesc);
      }
      // Set location default if empty or matches a category label
      const isCurrentlyCategory = categories.some(c => c.label === newLocation);
      if (!newLocation || isCurrentlyCategory) {
        setNewLocation(category.label);
      }
    }
  }, [newCat, isPosting]);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'all', icon: Users, label: 'All' },
    { id: 'gym', icon: Dumbbell, label: 'Gym' },
    { id: 'swimming', icon: MapPin, label: 'Swimming' },
    { id: 'coffee', icon: Coffee, label: 'Coffee' },
    { id: 'cab', icon: Car, label: 'Cab' },
    { id: 'vacation', icon: Palmtree, label: 'Vacation' },
    { id: 'other', icon: Users, label: 'Other' },
  ];

  const filteredPosts = posts.filter(p => {
    const isCatMatch = activeCategory === 'all' || p.category === activeCategory;
    const isStatusActive = p.status === 'active';
    const isNotExpired = ensureMillis(p.expiresAt) > currentTime;
    return isCatMatch && isStatusActive && isNotExpired;
  });

  const handleClose = async (id: string) => {
    await onCloseBuddy(id);
  };

  const handleDelete = async (id: string) => {
    await onDeleteBuddy(id);
  };

  const handleSubmit = async () => {
    if (newTitle.trim() && newDesc.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onPostBuddy(newCat, newTitle, newDesc, newWindow, allowDMs, newLocation, newDate);
        setIsPosting(false);
        setNewTitle('');
        setNewDesc('');
        setNewLocation('');
        setNewDate(format(new Date(), "d MMM"));
        setNewWindow(15);
        setAllowDMs(true);
      } catch (error) {
        console.error("Submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-32 px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-ramos-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">Network Discovery</span>
          </div>
          <h2 className="text-6xl font-bold text-ramos-black tracking-tighter leading-none mb-6">Buddy Finder</h2>
          <p className="text-ramos-black/40 text-sm font-bold uppercase tracking-widest leading-loose">Establish connections within the campus network for shared activities.</p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="flex items-center space-x-4 px-10 py-5 rounded-[28px] bg-ramos-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-ramos-red hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-ramos-black/20 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>New Engagement</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-4 mb-16 overflow-x-auto pb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              "flex items-center space-x-3 px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all border",
              activeCategory === cat.id 
                ? "bg-ramos-black text-white border-ramos-black shadow-2xl shadow-ramos-black/20 scale-105" 
                : "bg-white text-ramos-black/40 hover:text-ramos-black hover:bg-ramos-gray border-ramos-black/5"
            )}
          >
            <cat.icon className={cn("w-4 h-4", activeCategory === cat.id ? "text-ramos-red" : "")} />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? filteredPosts.map((post) => {
            return (
              <BuddyCard
                key={post.id}
                post={post}
                onConnect={onConnect}
                onLeave={onLeaveBuddy}
                onClose={handleClose}
                onDelete={handleDelete}
                onExtend={onExtendBuddy}
                onSendMessage={onSendMessage}
                currentUserId={currentUserId}
                allUsers={allUsers}
              />
            );
          }) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-32 flex flex-col items-center justify-center bg-ramos-gray/30 border border-dashed border-ramos-black/5 rounded-[56px] text-center"
            >
              <div className="w-24 h-24 rounded-[36px] bg-white border border-ramos-black/5 flex items-center justify-center text-ramos-black/10 mb-8 shadow-2xl shadow-ramos-black/5">
                <Users className="w-10 h-10" />
              </div>
              <p className="text-ramos-black/20 font-black uppercase tracking-[0.3em] text-[10px]">No active engagements found</p>
              <p className="text-ramos-black/10 text-[9px] font-bold uppercase tracking-widest mt-4">Initiate a new request to establish network connectivity.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {isPosting && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosting(false)}
              className="absolute inset-0 bg-ramos-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white border border-ramos-black/5 rounded-[56px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-10 border-b border-ramos-black/5 flex items-center justify-between bg-ramos-gray/10">
                <div>
                   <h3 className="text-3xl font-bold text-ramos-black tracking-tight mb-1">Establish Engagement</h3>
                   <p className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.2em]">Institutional Connection Protocol</p>
                </div>
                <button 
                  onClick={() => setIsPosting(false)}
                  className="p-4 rounded-3xl bg-white border border-ramos-black/5 text-ramos-black/20 hover:text-ramos-red hover:bg-ramos-red/5 transition-all active:scale-95 shadow-xl shadow-ramos-black/5"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 no-scrollbar space-y-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] ml-6">Engagement Category</label>
                  <div className="grid grid-cols-3 gap-4">
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewCat(cat.id as any)}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-[32px] border transition-all group",
                          newCat === cat.id 
                            ? "bg-ramos-black border-ramos-black text-white shadow-2xl shadow-ramos-black/20" 
                            : "bg-ramos-gray border-transparent text-ramos-black/20 hover:bg-ramos-black/5"
                        )}
                      >
                        <cat.icon className={cn("w-6 h-6 mb-3 transition-transform group-hover:scale-110", newCat === cat.id ? "text-ramos-red" : "")} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] ml-6">Engagement Objective</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Brief description of activity..."
                    className="w-full bg-ramos-gray border border-transparent rounded-[28px] py-6 px-10 text-ramos-black text-base font-bold focus:bg-white focus:border-ramos-red/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] ml-6">Location Reference</label>
                    <div className="relative">
                       <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-ramos-black/20" />
                       <input 
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Campus Venue"
                        className="w-full bg-ramos-gray border border-transparent rounded-[24px] py-5 pl-16 pr-8 text-ramos-black text-sm font-bold focus:bg-white focus:border-ramos-red/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] ml-6">Engagement Time</label>
                    <div className="relative">
                       <Calendar className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-ramos-black/20" />
                       <input 
                        type="text"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        placeholder="Scheduled Period"
                        className="w-full bg-ramos-gray border border-transparent rounded-[24px] py-5 pl-16 pr-8 text-ramos-black text-sm font-bold focus:bg-white focus:border-ramos-red/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] ml-6">Detailed Specifications</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Additional institutional requirements or notes..."
                    className="w-full bg-ramos-gray border border-transparent rounded-[32px] py-8 px-10 text-ramos-black text-base font-bold focus:bg-white focus:border-ramos-red/20 outline-none min-h-[160px] resize-none transition-all"
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-ramos-black/20 uppercase tracking-[0.3em] ml-6">Broadcast Validity Period</label>
                  <div className="grid grid-cols-4 gap-4">
                    {[15, 30, 45, 60].map((min) => (
                      <button
                        key={min}
                        onClick={() => setNewWindow(min)}
                        className={cn(
                          "py-5 rounded-[24px] text-[11px] font-black transition-all border",
                          newWindow === min 
                            ? "bg-ramos-black text-white border-ramos-black shadow-2xl shadow-ramos-black/20 scale-105" 
                            : "bg-ramos-gray text-ramos-black/20 border-transparent hover:bg-ramos-black/5"
                        )}
                      >
                        {min} MINS
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-8 bg-ramos-gray/40 rounded-[36px] border border-ramos-black/5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ramos-black tracking-tight">Establish Communication Channel</span>
                    <span className="text-[10px] font-black text-ramos-black/30 uppercase tracking-widest mt-1">Enable direct network messaging</span>
                  </div>
                  <button 
                    onClick={() => setAllowDMs(!allowDMs)}
                    className={cn(
                      "w-16 h-8 rounded-full relative transition-all duration-500",
                      allowDMs ? "bg-ramos-red shadow-xl shadow-ramos-red/20" : "bg-ramos-black/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-2xl",
                      allowDMs ? "left-9" : "left-1.5"
                    )} />
                  </button>
                </div>
              </div>

              <div className="p-10 bg-ramos-gray/10 border-t border-ramos-black/5 flex items-center justify-between">
                 <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-black/20">System Ready</span>
                </div>
                <div className="flex space-x-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsPosting(false)}
                    className="flex-1 sm:flex-none px-10 py-5 rounded-[24px] bg-white border border-ramos-black/5 text-ramos-black/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-ramos-black hover:text-white transition-all shadow-xl shadow-ramos-black/5 active:scale-95"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!newTitle.trim() || !newDesc.trim() || isSubmitting}
                    className={cn(
                      "flex-1 sm:flex-none px-16 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center shadow-2xl active:scale-95",
                      (!newTitle.trim() || !newDesc.trim() || isSubmitting)
                        ? "bg-ramos-gray text-ramos-black/10 border border-ramos-black/5 cursor-not-allowed"
                        : "bg-ramos-black text-white hover:bg-ramos-red shadow-ramos-black/20"
                    )}
                  >
                    {isSubmitting ? <span className="animate-pulse px-2">Broadcasting...</span> : "Establish"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuddyFinder;
