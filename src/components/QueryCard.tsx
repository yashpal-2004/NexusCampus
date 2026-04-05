import React, { useState } from 'react';
import { 
  ArrowBigUp, 
  MessageCircle, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { StudentQuery, QueryReply } from '../types';
import { cn, ensureMillis } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface QueryCardProps {
  query: StudentQuery;
  onUpvote: (id: string) => void;
  onReply: (id: string, content: string) => void;
  currentUserId?: string;
}

const QueryCard: React.FC<QueryCardProps> = ({ query, onUpvote, onReply, currentUserId }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const hasUpvoted = currentUserId && query.upvotes.includes(currentUserId);
  const voteCount = query.upvotes.length;

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(query.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-3xl p-5 mb-4 hover:border-orange-200 transition-all group shadow-sm"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold text-lg overflow-hidden border border-slate-200">
          {query.authorPhoto ? (
            <img src={query.authorPhoto} alt={query.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            query.authorName[0]
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm">{query.authorName}</span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-400 text-xs">{formatDistanceToNow(ensureMillis(query.createdAt))} ago</span>
              {query.status === 'resolved' && (
                <span className="flex items-center space-x-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-green-100">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Resolved</span>
                </span>
              )}
              {query.status === 'pending' && (
                <span className="flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </span>
              )}
            </div>
            <button className="text-slate-300 hover:text-slate-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {query.content}
          </p>
          
          {query.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-100 mb-4">
              <img 
                src={query.imageUrl} 
                alt="Query attachment" 
                className="w-full h-auto object-cover max-h-96"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1 bg-slate-50 rounded-full p-1 border border-slate-100">
              <button 
                onClick={() => onUpvote(query.id)}
                className={cn(
                  "p-1.5 rounded-full transition-all",
                  hasUpvoted ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
              >
                <ArrowBigUp className={cn("w-5 h-5", hasUpvoted ? "fill-current" : "")} />
              </button>
              <span className={cn(
                "text-xs font-bold px-2 min-w-[2ch] text-center",
                voteCount > 0 ? "text-orange-600" : "text-slate-400"
              )}>
                {voteCount}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className={cn(
                  "flex items-center space-x-1.5 transition-colors group/btn",
                  isReplying ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full transition-colors",
                  isReplying ? "bg-orange-50" : "group-hover/btn:bg-orange-50"
                )}>
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">{query.replies?.length || 0} Replies</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-100 space-y-4"
              >
                {/* Replies List */}
                {query.replies && query.replies.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {query.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden border border-slate-200">
                          {reply.authorPhoto ? (
                            <img src={reply.authorPhoto} alt={reply.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            reply.authorName[0]
                          )}
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-900">{reply.authorName}</span>
                            <span className="text-[8px] text-slate-400">{formatDistanceToNow(ensureMillis(reply.createdAt))} ago</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 transition-colors outline-none"
                  />
                  <button 
                    onClick={handleReplySubmit}
                    disabled={!replyContent.trim()}
                    className="p-2 rounded-xl bg-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/10"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default QueryCard;
