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
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">Find a Buddy</h2>
          <p className="text-slate-500 text-sm font-medium">Don't go alone. Find your partner for anything.</p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>POST REQUEST</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all",
              activeCategory === cat.id 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
            )}
          >
            <cat.icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] text-center"
            >
              <div className="p-6 rounded-full bg-slate-100 text-slate-300 mb-4">
                <Users className="w-12 h-12" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No buddy requests found</p>
              <p className="text-slate-300 text-[10px] mt-2">Try posting one or switching categories!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {isPosting && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosting(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">Find Your Buddy</h3>
                <button 
                  onClick={() => setIsPosting(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewCat(cat.id as any)}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
                          newCat === cat.id 
                            ? "bg-orange-50 border-orange-500 text-orange-600" 
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        <cat.icon className="w-5 h-5 mb-2" />
                        <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <span>Title</span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Looking for a Gym Partner"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <MapPin className="w-3 h-3 mr-2" />
                      <span>Location</span>
                    </label>
                    <input 
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Gym A"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      <span>Date</span>
                    </label>
                    <input 
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="e.g. 5 PM Today"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <span>Description</span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Tell them more about what you're looking for..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors min-h-[120px] resize-none outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>How long is this valid?</span>
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[15, 30, 45, 60].map((min) => (
                      <button
                        key={min}
                        onClick={() => setNewWindow(min)}
                        className={cn(
                          "py-3 rounded-2xl text-xs font-black transition-all",
                          newWindow === min 
                            ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20 scale-105" 
                            : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100"
                        )}
                      >
                        {min}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Allow Direct Messages</span>
                    <span className="text-[10px] text-slate-400">Let others message you directly</span>
                  </div>
                  <button 
                    onClick={() => setAllowDMs(!allowDMs)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      allowDMs ? "bg-orange-500" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      allowDMs ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
                  </div>
                </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <div className="hidden sm:flex items-center space-x-2 text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-nowrap">NexusCampus Sync</span>
                </div>
                <div className="flex space-x-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsPosting(false)}
                    className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!newTitle.trim() || !newDesc.trim() || isSubmitting}
                    className={cn(
                      "flex-1 sm:flex-none px-10 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center",
                      (!newTitle.trim() || !newDesc.trim() || isSubmitting)
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20"
                    )}
                  >
                    {isSubmitting ? <span className="animate-pulse px-2">POSTING...</span> : "POST NOW"}
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
