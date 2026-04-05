import React from 'react';
import { StudentQuery, BlinkitRequest } from '../types';
import QueryCard from './QueryCard';
import BlinkitCard from './BlinkitCard';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';
import { ensureMillis } from '../lib/utils';

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
  currentUserId 
}) => {
  // Combine and sort by createdAt
  const allItems = [
    ...queries.map(q => ({ ...q, type: 'query' as const })),
    ...blinkitRequests.map(b => ({ ...b, type: 'blinkit' as const }))
  ].sort((a, b) => ensureMillis(b.createdAt) - ensureMillis(a.createdAt));

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-24 px-4 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-orange-500" />
          <span>For You</span>
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {allItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {item.type === 'query' ? (
              <QueryCard 
                query={item as StudentQuery} 
                onUpvote={onUpvote} 
                onReply={onReply}
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
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenPostModal}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl shadow-orange-500/20 z-40 border border-white/20"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
};

export default Feed;
