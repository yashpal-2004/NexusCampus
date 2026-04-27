import React from 'react';
import { StudentQuery, BlinkitRequest } from '../../types';
import QueryCard from './QueryCard';
import BlinkitCard from './BlinkitCard';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Zap } from 'lucide-react';
import { ensureMillis } from '../../lib/utils';

interface FeedProps {
  queries: StudentQuery[];
  blinkitRequests: BlinkitRequest[];
  onUpvote: (id: string) => void;
  onReply: (id: string, content: string) => void;
  onJoinBlinkit: (id: string) => void;
  onLeaveBlinkit?: (id: string) => void;
  onCloseBlinkit?: (id: string) => void;
  onDeleteBlinkit?: (id: string) => void;
  onExtendBlinkit?: (id: string, mins: number) => void;
  onSendBlinkitMessage?: (id: string, content: string) => void;
  onRemoveBlinkitParticipant?: (requestId: string, participantUid: string) => void;
  onBlockBlinkitParticipant?: (participantUid: string) => void;
  onOpenPostModal: () => void;
  onDeleteQuery: (id: string) => void;
  currentUserId?: string;
}

const Feed: React.FC<FeedProps> = ({ 
  queries, 
  blinkitRequests, 
  onUpvote, 
  onReply,
  onJoinBlinkit, 
  onLeaveBlinkit,
  onCloseBlinkit,
  onDeleteBlinkit,
  onExtendBlinkit,
  onSendBlinkitMessage,
  onRemoveBlinkitParticipant,
  onBlockBlinkitParticipant,
  onOpenPostModal,
  onDeleteQuery,
  currentUserId 
}) => {
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Combine and sort by createdAt
  const allItems = [
    ...queries.map(q => ({ ...q, type: 'query' as const })),
    ...blinkitRequests.filter(b => {
      const bExp = Number(b.expiresAt) || 0;
      return b.status === 'active' && bExp > currentTime;
    }).map(b => ({ ...b, type: 'blinkit' as const }))
  ].sort((a, b) => ensureMillis(b.createdAt) - ensureMillis(a.createdAt));

  return (
    <div className="max-w-3xl mx-auto pt-12 pb-32 px-6 relative">
      <div className="flex flex-col space-y-2 mb-16">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-ramos-red animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ramos-red">Live Campus</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-6xl font-bold text-ramos-black tracking-tighter leading-none">
            Campus Hub
          </h2>
          <div className="hidden md:flex items-center space-x-4">
             <div className="px-4 py-2 rounded-2xl bg-ramos-gray border border-ramos-black/5 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-ramos-red" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-ramos-black/40">{allItems.length} Recent Posts</span>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {allItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-8"
          >
            {item.type === 'query' ? (
              <QueryCard 
                query={item as StudentQuery} 
                onUpvote={onUpvote} 
                onReply={onReply}
                onDelete={(item.id.startsWith('mock_') || (item as StudentQuery).authorUid !== currentUserId) ? undefined : onDeleteQuery}
                currentUserId={currentUserId}
              />
            ) : (
              <BlinkitCard 
                request={item as BlinkitRequest} 
                onJoin={onJoinBlinkit} 
                onLeave={onLeaveBlinkit}
                onClose={onCloseBlinkit}
                onDelete={onDeleteBlinkit}
                onExtend={onExtendBlinkit}
                onSendMessage={onSendBlinkitMessage}
                onRemoveParticipant={onRemoveBlinkitParticipant}
                onBlockParticipant={onBlockBlinkitParticipant}
                currentUserId={currentUserId}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenPostModal}
        className="fixed bottom-12 right-12 px-8 py-5 rounded-[32px] bg-ramos-black text-white flex items-center space-x-4 shadow-2xl shadow-ramos-black/20 z-40 border border-white/10 group transition-all"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        <span className="text-sm font-bold uppercase tracking-widest">Create Post</span>
      </motion.button>
    </div>
  );
};

export default Feed;
