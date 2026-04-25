import React, { useState } from 'react';
import { StudentQuery, BlinkitRequest, BuddyPost, UserProfile } from '../types';
import QueryCard from './QueryCard';
import BlinkitCard from './BlinkitCard';
import BuddyCard from './BuddyCard';
import { MessageSquare, CheckCircle, ShoppingBag, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface MyActivityProps {
  userQueries: StudentQuery[];
  expiredBlinkitRequests: BlinkitRequest[];
  expiredBuddyRequests: BuddyPost[];
  onReply: (id: string, content: string) => void;
  onResolve: (id: string) => void;
  onExtendBlinkit?: (id: string, mins: number) => void;
  onExtendBuddy?: (id: string, mins: number) => void;
  onDeleteBlinkit?: (id: string) => void;
  currentUserId: string;
  allUsers: UserProfile[];
}

const MyActivity: React.FC<MyActivityProps> = ({ 
  userQueries, 
  expiredBlinkitRequests, 
  expiredBuddyRequests,
  onReply, 
  onResolve,
  onExtendBlinkit,
  onExtendBuddy,
  onDeleteBlinkit,
  currentUserId,
  allUsers
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queries' | 'blinkit' | 'buddy'>('queries');

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">My Activity</h2>
          <p className="text-slate-500 text-sm font-medium">History of your campus contributions.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('queries')}
            className={cn(
              "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
              activeSubTab === 'queries' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="uppercase tracking-widest">Queries</span>
          </button>
          <button
            onClick={() => setActiveSubTab('blinkit')}
            className={cn(
              "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
              activeSubTab === 'blinkit' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="uppercase tracking-widest">Orders</span>
          </button>
          <button
            onClick={() => setActiveSubTab('buddy')}
            className={cn(
              "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
              activeSubTab === 'buddy' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Users className="w-4 h-4" />
            <span className="uppercase tracking-widest">Buddies</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {activeSubTab === 'queries' && (
            <motion.div
              key="queries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {userQueries.length === 0 ? (
                <div className="p-16 rounded-[40px] border-2 border-dashed border-slate-200 text-center space-y-4 text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto opacity-20" />
                  <p className="text-sm font-black uppercase tracking-widest opacity-40">No queries posted yet</p>
                </div>
              ) : (
                userQueries.map((query) => (
                  <div key={query.id} className="relative">
                    <QueryCard 
                      query={query} 
                      onUpvote={() => {}} 
                      onReply={onReply}
                      currentUserId={currentUserId}
                    />
                    {query.status !== 'resolved' && (
                      <button
                        onClick={() => onResolve(query.id)}
                        className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/60 hover:text-white transition-all z-10"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Resolve</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeSubTab === 'blinkit' && (
            <motion.div
              key="blinkit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {expiredBlinkitRequests.length === 0 ? (
                <div className="p-16 rounded-[40px] border-2 border-dashed border-slate-200 text-center space-y-4 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-20" />
                  <p className="text-sm font-black uppercase tracking-widest opacity-40">No order history found</p>
                </div>
              ) : (
                expiredBlinkitRequests.map((req) => (
                  <BlinkitCard 
                    key={req.id} 
                    request={req} 
                    onJoin={() => {}} 
                    onExtend={onExtendBlinkit}
                    onDelete={onDeleteBlinkit}
                    currentUserId={currentUserId}
                    showExtend={true}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeSubTab === 'buddy' && (
            <motion.div
              key="buddy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {expiredBuddyRequests.length === 0 ? (
                <div className="p-16 rounded-[40px] border-2 border-dashed border-slate-200 text-center space-y-4 text-slate-400">
                  <Users className="w-12 h-12 mx-auto opacity-20" />
                  <p className="text-sm font-black uppercase tracking-widest opacity-40">No buddy history found</p>
                </div>
              ) : (
                expiredBuddyRequests.map((post) => (
                  <BuddyCard 
                    key={post.id} 
                    post={post} 
                    onConnect={() => {}} 
                    onLeave={() => {}}
                    onClose={() => {}}
                    onDelete={() => {}}
                    onExtend={onExtendBuddy}
                    onSendMessage={() => {}}
                    currentUserId={currentUserId}
                    allUsers={allUsers}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyActivity;
