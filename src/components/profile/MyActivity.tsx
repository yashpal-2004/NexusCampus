import React, { useState } from 'react';
import { StudentQuery, BlinkitRequest, BuddyPost, UserProfile } from '../../types';
import QueryCard from '../feed/QueryCard';
import BlinkitCard from '../feed/BlinkitCard';
import BuddyCard from '../social/BuddyCard';
import { MessageSquare, CheckCircle, ShoppingBag, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface MyActivityProps {
  userQueries: StudentQuery[];
  expiredBlinkitRequests: BlinkitRequest[];
  expiredBuddyRequests: BuddyPost[];
  onReply: (id: string, content: string) => void;
  onResolve: (id: string) => void;
  onExtendBlinkit?: (id: string, mins: number) => void;
  onExtendBuddy?: (id: string, mins: number) => void;
  onDeleteBlinkit?: (id: string) => void;
  onLeaveBlinkit?: (id: string) => void;
  onCloseBlinkit?: (id: string) => void;
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
  onLeaveBlinkit,
  onCloseBlinkit,
  currentUserId,
  allUsers
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queries' | 'blinkit' | 'buddy'>('queries');

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-32 px-6">
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-ramos-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">My Activity</span>
          </div>
          <h2 className="text-6xl font-bold text-ramos-black tracking-tighter leading-none mb-4">Dashboard</h2>
          <p className="text-ramos-black/40 text-sm font-bold uppercase tracking-widest">Manage your contributions</p>
        </div>

        <div className="flex bg-ramos-gray p-1.5 rounded-[24px] border border-ramos-black/5">
          <button
            onClick={() => setActiveSubTab('queries')}
            className={cn(
              "flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]",
              activeSubTab === 'queries' ? "bg-white text-ramos-black shadow-xl shadow-ramos-black/5" : "text-ramos-black/20 hover:text-ramos-black"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Queries</span>
          </button>
          <button
            onClick={() => setActiveSubTab('blinkit')}
            className={cn(
              "flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]",
              activeSubTab === 'blinkit' ? "bg-white text-ramos-black shadow-xl shadow-ramos-black/5" : "text-ramos-black/20 hover:text-ramos-black"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveSubTab('buddy')}
            className={cn(
              "flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]",
              activeSubTab === 'buddy' ? "bg-white text-ramos-black shadow-xl shadow-ramos-black/5" : "text-ramos-black/20 hover:text-ramos-black"
            )}
          >
            <Users className="w-4 h-4" />
            <span>Buddies</span>
          </button>
        </div>
      </div>

      <div className="space-y-12">
        <AnimatePresence mode="wait">
          {activeSubTab === 'queries' && (
            <motion.div
              key="queries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8"
            >
              {userQueries.length === 0 ? (
                <div className="p-24 rounded-[48px] border-2 border-dashed border-ramos-gray text-center space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-ramos-gray flex items-center justify-center mx-auto">
                    <MessageSquare className="w-10 h-10 text-ramos-black/10" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-black/20">Intelligence Hub Empty</p>
                </div>
              ) : (
                userQueries.map((query) => (
                  <div key={query.id} className="relative group">
                    <QueryCard 
                      query={query} 
                      onUpvote={() => {}} 
                      onReply={onReply}
                      currentUserId={currentUserId}
                    />
                    {query.status !== 'resolved' && (
                      <button
                        onClick={() => onResolve(query.id)}
                        className="absolute top-8 right-32 flex items-center space-x-2 px-6 py-3 rounded-2xl bg-green-500 text-white shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all z-10 text-[10px] font-black uppercase tracking-widest"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Resolve Post</span>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8"
            >
              {expiredBlinkitRequests.length === 0 ? (
                <div className="p-24 rounded-[48px] border-2 border-dashed border-ramos-gray text-center space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-ramos-gray flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-10 h-10 text-ramos-black/10" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-black/20">No orders found</p>
                </div>
              ) : (
                expiredBlinkitRequests.map((req) => (
                  <BlinkitCard 
                    key={req.id} 
                    request={req} 
                    onJoin={() => {}} 
                    onLeave={onLeaveBlinkit}
                    onClose={onCloseBlinkit}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8"
            >
              {expiredBuddyRequests.length === 0 ? (
                <div className="p-24 rounded-[48px] border-2 border-dashed border-ramos-gray text-center space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-ramos-gray flex items-center justify-center mx-auto">
                    <Users className="w-10 h-10 text-ramos-black/10" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-black/20">Network History Clear</p>
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
