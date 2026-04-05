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
  MapPin 
} from 'lucide-react';
import { BuddyPost } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface BuddyFinderProps {
  posts: BuddyPost[];
  onPostBuddy: (category: BuddyPost['category'], title: string, description: string, allowDMs: boolean) => void;
  onConnect: (post: BuddyPost) => void;
  onDeleteBuddy: (id: string) => void;
  onCloseBuddy: (id: string) => void;
  onUpdateBuddy: (id: string, updates: Partial<BuddyPost>) => void;
  currentUserId?: string;
}

const BuddyFinder: React.FC<BuddyFinderProps> = ({ 
  posts, 
  onPostBuddy, 
  onConnect, 
  onDeleteBuddy,
  onCloseBuddy,
  onUpdateBuddy,
  currentUserId 
}) => {
  const [activeCategory, setActiveCategory] = useState<BuddyPost['category'] | 'all'>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<BuddyPost['category']>('gym');
  const [allowDMs, setAllowDMs] = useState(true);

  const categories = [
    { id: 'all', icon: Users, label: 'All' },
    { id: 'gym', icon: Dumbbell, label: 'Gym' },
    { id: 'swimming', icon: MapPin, label: 'Swimming' },
    { id: 'coffee', icon: Coffee, label: 'Coffee' },
    { id: 'cab', icon: Car, label: 'Cab' },
    { id: 'vacation', icon: Palmtree, label: 'Vacation' },
    { id: 'other', icon: Users, label: 'Other' },
  ];

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const handleSubmit = () => {
    if (newTitle.trim() && newDesc.trim()) {
      onPostBuddy(newCat, newTitle, newDesc, allowDMs);
      setIsPosting(false);
      setNewTitle('');
      setNewDesc('');
      setAllowDMs(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Find a Buddy</h2>
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
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "bg-white border border-slate-200 rounded-[32px] p-6 hover:shadow-xl transition-all group relative",
                post.status === 'closed' && "opacity-60 grayscale"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                  {(() => {
                    const CategoryIcon = categories.find(c => c.id === post.category)?.icon || Users;
                    return <CategoryIcon className="w-6 h-6" />;
                  })()}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {post.category}
                  </span>
                  {post.status === 'closed' && (
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">
                      CLOSED
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{post.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                {post.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {post.authorName[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{post.authorName}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {currentUserId === post.authorUid ? (
                    <div className="flex items-center space-x-2">
                      {post.status === 'open' && (
                        <button 
                          onClick={() => onCloseBuddy(post.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 transition-all"
                        >
                          CLOSE
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteBuddy(post.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold hover:bg-red-100 transition-all"
                      >
                        DELETE
                      </button>
                    </div>
                  ) : (
                    post.status === 'open' && (
                      <button 
                        onClick={() => onConnect(post)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>CONNECT</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))}
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
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[40px] p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tighter">Find Your Buddy</h3>
              
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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Looking for a Gym Partner"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Tell them more about what you're looking for..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-colors min-h-[120px] resize-none outline-none"
                  />
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

                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={() => setIsPosting(false)}
                    className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    POST NOW
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
