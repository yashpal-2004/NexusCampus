import React, { useState } from 'react';
import { BuddyPost, UserProfile } from '../types';
import { Users, MessageCircle, MapPin, Calendar, Clock, Trash2, Shield, AlertCircle, Plus, User, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ensureMillis } from '../lib/utils';

interface BuddyCardProps {
  post: BuddyPost;
  onConnect: (id: string) => void;
  onLeave: (id: string) => void;
  onClose: (id: string) => void;
  onDelete: (id: string) => void;
  onSendMessage: (id: string, content: string) => void;
  onExtend?: (id: string, mins: number) => void;
  currentUserId: string;
  allUsers: UserProfile[];
}

const BuddyCard: React.FC<BuddyCardProps> = ({
  post,
  onConnect,
  onLeave,
  onClose,
  onDelete,
  onSendMessage,
  onExtend,
  currentUserId,
  allUsers
}) => {
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [extendMins, setExtendMins] = useState(15);
  const [isClosing, setIsClosing] = useState(false);
  
  const isJoined = post.joinedUids?.includes(currentUserId);
  const isCreator = currentUserId === post.authorUid;
  const isExpired = post.status !== 'active';
  const [graceTimeLeft, setGraceTimeLeft] = useState<number | null>(null);

  const canExtend = isCreator && isExpired && !!onExtend && graceTimeLeft !== null;

  React.useEffect(() => {
    if (isExpired && isCreator) {
      const updateGrace = () => {
        const now = Date.now();
        const baseTime = post.closedAt ? ensureMillis(post.closedAt) : ensureMillis(post.expiresAt);
        const elapsed = now - baseTime;
        
        // Only show if we are within 60s AFTER baseTime
        const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
        
        if (remaining <= 0 || elapsed < -1000) {
          setGraceTimeLeft(null);
        } else {
          setGraceTimeLeft(remaining);
        }
      };
      updateGrace();
      const interval = setInterval(updateGrace, 1000);
      return () => clearInterval(interval);
    } else {
      setGraceTimeLeft(null);
    }
  }, [isExpired, isCreator, post.expiresAt, post.closedAt]);

  return (
    <motion.div
      layout
      className={cn(
        "bg-white border rounded-[40px] p-8 transition-all relative overflow-hidden",
        isExpired ? "opacity-60 grayscale bg-slate-50 border-slate-200" : "border-slate-100 hover:border-orange-200 shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200">
            {post.authorPhoto ? (
              <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-black text-slate-900 tracking-tight">{post.authorName}</h4>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[10px] font-bold text-slate-400">{formatDistanceToNow(ensureMillis(post.createdAt))} ago</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-1">{post.category}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
           {(isJoined || isCreator) && !isExpired && post.allowDMs && (
             <button 
               onClick={() => setIsMessaging(!isMessaging)}
               className={cn(
                 "p-2.5 rounded-2xl transition-all border",
                 isMessaging ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
               )}
             >
               <MessageCircle className="w-4 h-4" />
             </button>
           )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{post.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">{post.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center space-x-2.5 bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <MapPin className="w-4 h-4 text-orange-500" />
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Venue</span>
            <span className="text-[11px] font-bold text-slate-600 truncate uppercase">{post.location || post.category}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <Calendar className="w-4 h-4 text-orange-500" />
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date</span>
            <span className="text-[11px] font-bold text-slate-600 truncate">{post.date || 'Flexible'}</span>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="mb-6 space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collaborators</p>
        <div className="flex flex-wrap gap-2">
          {/* Host */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
            <div className="w-5 h-5 rounded-lg bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden border border-orange-600">
              {post.authorPhoto ? (
                <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" />
              ) : (
                <span className="leading-none">{post.authorName?.[0]}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-900 leading-none">{post.authorName}</span>
              <span className="text-[7px] font-black text-orange-500 uppercase tracking-tighter mt-0.5">Host Author</span>
            </div>
          </div>

          {/* Others */}
          {post.joinedUids?.filter(uid => uid !== post.authorUid).map((uid) => {
             const p = allUsers.find(u => u.uid === uid);
             if (!p) return null;
             return (
               <div key={uid} className="flex items-center space-x-2 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 shadow-sm">
                 <div className="w-5 h-5 rounded-lg bg-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-600 overflow-hidden border border-orange-200">
                   {p.photoURL ? (
                     <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" />
                   ) : (
                     <span className="leading-none">{p.displayName?.[0]}</span>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black text-slate-900 leading-none">{p.displayName}</span>
                   <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">Connected</span>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isMessaging && (isJoined || isCreator) && !isExpired && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-slate-50 rounded-[32px] border border-slate-100"
          >
            <div className="max-h-48 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
              {post.messages && post.messages.length > 0 ? (
                post.messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex flex-col",
                    msg.senderUid === currentUserId ? "items-end" : "items-start"
                  )}>
                    <div className="flex items-center space-x-2 mb-1.5 px-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                      <span className="text-[8px] font-bold text-slate-300">{formatDistanceToNow(ensureMillis(msg.createdAt))} ago</span>
                    </div>
                    <div className={cn(
                      "px-5 py-3 rounded-[24px] text-xs font-medium max-w-[85%] shadow-sm",
                      msg.senderUid === currentUserId 
                        ? "bg-orange-500 text-white rounded-tr-none" 
                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No messages yet</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200">
              <input 
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && messageContent.trim()) {
                    onSendMessage(post.id, messageContent);
                    setMessageContent('');
                  }
                }}
                className="flex-1 bg-transparent py-2 px-4 text-xs font-medium outline-none"
              />
              <button 
                onClick={() => {
                  if (messageContent.trim()) {
                    onSendMessage(post.id, messageContent);
                    setMessageContent('');
                  }
                }}
                className="p-3 rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <Users className="w-4 h-4" />
          <span>{post.joinedUids?.length || 1} Connected</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isCreator ? (
            <div className="flex items-center space-x-2">
              {!isExpired && (
                <button 
                  disabled={isClosing}
                  onClick={async () => {
                    setIsClosing(true);
                    try {
                      await onClose(post.id);
                    } finally {
                      setIsClosing(false);
                    }
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                    isClosing 
                      ? "bg-slate-50 text-slate-300 border-slate-100 cursor-wait" 
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                  )}
                >
                  {isClosing ? 'Closing...' : 'Close'}
                </button>
              )}
              {canExtend && (
                <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <input 
                    type="number" 
                    value={extendMins}
                    onChange={(e) => setExtendMins(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 bg-transparent text-center text-xs font-bold text-slate-900 outline-none"
                  />
                  <button 
                    onClick={() => onExtend(post.id, extendMins)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                  >
                    Extend {graceTimeLeft !== null && `(${graceTimeLeft}s)`}
                  </button>
                </div>
              )}
              <button 
                onClick={() => onDelete(post.id)}
                className="px-5 py-2.5 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
              >
                Delete
              </button>
            </div>
          ) : (
            !isExpired && (
              <div className="flex items-center space-x-2">
                {isJoined && (
                  <button 
                    onClick={() => onLeave(post.id)}
                    className="px-5 py-2.5 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                  >
                    Disconnect
                  </button>
                )}
                <button 
                  onClick={() => !isJoined && onConnect(post.id)}
                  disabled={isJoined}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-2.5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all",
                    isJoined 
                      ? "bg-green-50 text-green-600 border border-green-200 cursor-default" 
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95"
                  )}
                >
                  {isJoined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BuddyCard;
