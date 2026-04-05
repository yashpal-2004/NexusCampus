import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Timer, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Trash2,
  User,
  MessageCircle,
  Send,
  Plus
} from 'lucide-react';
import { BlinkitRequest, BlinkitMessage } from '../types';
import { cn, ensureMillis } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface BlinkitCardProps {
  request: BlinkitRequest;
  onJoin: (id: string) => void;
  onLeave?: (id: string) => void;
  onClose?: (id: string) => void;
  onDelete?: (id: string) => void;
  onExtend?: (id: string, mins: number) => void;
  onSendMessage?: (id: string, content: string) => void;
  onRemoveParticipant?: (requestId: string, participantUid: string) => void;
  onBlockParticipant?: (participantUid: string) => void;
  currentUserId?: string;
}

const BlinkitCard: React.FC<BlinkitCardProps> = ({ 
  request, 
  onJoin, 
  onLeave,
  onClose, 
  onDelete, 
  onExtend,
  onSendMessage,
  onRemoveParticipant,
  onBlockParticipant,
  currentUserId 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [extendMins, setExtendMins] = useState<number>(10);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const isJoined = currentUserId && request.joinedUids.includes(currentUserId);
  const isExpired = timeLeft <= 0 || request.status === 'expired';
  const isCreator = currentUserId === request.authorUid;
  const canSeeParticipants = !isExpired || isCreator || isJoined;
  const canMessage = isJoined || isCreator;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = Math.max(0, request.expiresAt - now);
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [request.expiresAt]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(100, (timeLeft / (request.windowMinutes * 60 * 1000)) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 mb-4 border transition-all duration-500 shadow-sm",
        isExpired 
          ? "bg-slate-50 border-slate-200 opacity-60" 
          : "bg-white border-slate-100 hover:border-orange-200"
      )}
    >
      {/* Progress Bar Background */}
      {!isExpired && (
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-orange-500"
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight leading-tight">
              Blinkit Shared Order
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {request.authorName} is ordering
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isCreator && !isExpired && (
            <button 
              onClick={() => onClose?.(request.id)}
              className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-100"
              title="Close Request"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          {isCreator && (
            <button 
              onClick={() => onDelete?.(request.id)}
              className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-100"
              title="Delete Request"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className={cn(
            "flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-tight",
            isExpired ? "bg-slate-100 text-slate-400" : "bg-orange-500 text-white shadow-md shadow-orange-500/20"
          )}>
            <Timer className="w-4 h-4" />
            <span>{isExpired ? "EXPIRED" : formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <p className="text-slate-600 font-medium text-sm mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 italic leading-relaxed">
        "{request.itemDescription}"
      </p>

      {/* Participants List */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participants</p>
          {canMessage && (
            <button 
              onClick={() => setIsMessaging(!isMessaging)}
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
                isMessaging ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              <MessageCircle className="w-3 h-3" />
              <span>{isMessaging ? 'CLOSE CHAT' : 'ORDER CHAT'}</span>
            </button>
          )}
        </div>
        
        {canSeeParticipants ? (
          <div className="flex flex-wrap gap-2">
            {request.participants?.map((p) => (
              <div key={p.uid} className="flex items-center space-x-2 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm group">
                <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-600 overflow-hidden border border-slate-200">
                  {p.photoURL ? (
                    <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-600">{p.displayName}</span>
                
                {isCreator && p.uid !== currentUserId && (
                  <div className="flex items-center space-x-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onRemoveParticipant?.(request.id, p.uid)}
                      className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove Participant"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => onBlockParticipant?.(p.uid)}
                      className="p-1 rounded-md hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
                      title="Block User"
                    >
                      <AlertCircle className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-100/50 rounded-xl p-3 border border-dashed border-slate-200 flex items-center justify-center space-x-2">
            <Users className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-medium text-slate-400 italic">Participants hidden for non-members</span>
          </div>
        )}
      </div>

      {/* Messaging Section */}
      <AnimatePresence>
        {isMessaging && canMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 border-t border-slate-100 pt-4"
          >
            <div className="max-h-48 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
              {request.messages && request.messages.length > 0 ? (
                request.messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex flex-col",
                    msg.senderUid === currentUserId ? "items-end" : "items-start"
                  )}>
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-[8px] font-bold text-slate-400">{msg.senderName}</span>
                      <span className="text-[8px] text-slate-300">• {formatDistanceToNow(ensureMillis(msg.createdAt))} ago</span>
                    </div>
                    <div className={cn(
                      "px-3 py-2 rounded-2xl text-xs max-w-[80%]",
                      msg.senderUid === currentUserId 
                        ? "bg-orange-500 text-white rounded-tr-none" 
                        : "bg-slate-100 text-slate-700 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-[10px] text-slate-400 italic">No messages yet. Coordinate your order here!</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && messageContent.trim() && (onSendMessage?.(request.id, messageContent), setMessageContent(''))}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 transition-colors outline-none"
              />
              <button 
                onClick={() => {
                  if (messageContent.trim()) {
                    onSendMessage?.(request.id, messageContent);
                    setMessageContent('');
                  }
                }}
                disabled={!messageContent.trim()}
                className="p-2 rounded-xl bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">
            {request.joinedUids.length} joined
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isCreator && isExpired && (
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <input 
                type="number" 
                value={extendMins}
                onChange={(e) => setExtendMins(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 bg-transparent text-center text-xs font-bold text-slate-900 outline-none"
                min="1"
              />
              <span className="text-[10px] font-bold text-slate-400 pr-1">MINS</span>
              <button
                onClick={() => onExtend?.(request.id, extendMins)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                <Plus className="w-3 h-3" />
                <span>EXTEND</span>
              </button>
            </div>
          )}
          
          {isJoined && !isCreator && (
            <button
              disabled={isLeaving}
              onClick={async () => {
                setIsLeaving(true);
                try {
                  await onLeave?.(request.id);
                } finally {
                  setIsLeaving(false);
                }
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all"
            >
              {isLeaving ? "REVOKING..." : "REVOKE JOIN"}
            </button>
          )}

          <button
            disabled={isExpired || isJoined || isJoining}
            onClick={async () => {
              setIsJoining(true);
              try {
                await onJoin(request.id);
              } finally {
                setIsJoining(false);
              }
            }}
            className={cn(
              "flex items-center space-x-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300",
              isJoined 
                ? "bg-green-50 text-green-600 border border-green-200" 
                : isExpired
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
            )}
          >
            {isJoining ? (
              <span className="animate-pulse">JOINING...</span>
            ) : isJoined ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>JOINED</span>
              </>
            ) : isExpired ? (
              <span>CLOSED</span>
            ) : (
              <>
                <span>JOIN NOW</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlinkitCard;
