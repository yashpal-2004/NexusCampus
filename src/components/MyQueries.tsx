import React from 'react';
import { StudentQuery } from '../types';
import QueryCard from './QueryCard';
import { MessageSquare, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MyQueriesProps {
  userQueries: StudentQuery[];
  onReply: (id: string, content: string) => void;
  onResolve: (id: string) => void;
}

const MyQueries: React.FC<MyQueriesProps> = ({ userQueries, onReply, onResolve }) => {
  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">My Queries</h2>
        <p className="text-slate-500 text-sm font-medium">Track and manage your campus questions.</p>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {userQueries.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 rounded-[40px] border border-dashed border-slate-200 text-center space-y-4 opacity-40 text-slate-400"
            >
              <MessageSquare className="w-12 h-12 mx-auto" />
              <p className="text-sm font-medium">You haven't posted any queries yet.</p>
            </motion.div>
          ) : (
            userQueries.map((query) => (
              <motion.div
                key={query.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <QueryCard 
                  query={query} 
                  onUpvote={() => {}} 
                  onReply={onReply}
                  currentUserId={query.authorUid}
                />
                {query.status !== 'resolved' && (
                  <button
                    onClick={() => onResolve(query.id)}
                    className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-all z-10"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Mark Resolved</span>
                  </button>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyQueries;
