import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatSession, UserProfile } from '../../types';
import { Send, User, MessageSquare, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface MessagingProps {
  user: UserProfile;
  messages: Message[];
  sessions: ChatSession[];
  onSendMessage: (recipientUid: string, content: string) => void;
}

const Messaging: React.FC<MessagingProps> = ({ user, messages, sessions, onSendMessage }) => {
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userSessions = sessions.filter(s => s.participants.includes(user.uid));

  const currentMessages = selectedSession 
    ? messages.filter(m => 
        (m.senderUid === user.uid && m.recipientUid === selectedSession.participants.find(p => p !== user.uid)) ||
        (m.recipientUid === user.uid && m.senderUid === selectedSession.participants.find(p => p !== user.uid))
      )
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedSession) return;
    const recipientUid = selectedSession.participants.find(p => p !== user.uid);
    if (recipientUid) {
      onSendMessage(recipientUid, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-xl">
      {/* Sessions List */}
      <div className={cn(
        "w-full md:w-80 border-r border-slate-100 flex flex-col transition-all duration-300",
        selectedSession ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
          {userSessions.length === 0 ? (
            <div className="text-center p-8 opacity-40">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
              <p className="text-[10px] text-slate-400 mt-2">Connect with buddies to start chatting!</p>
            </div>
          ) : (
            userSessions.map(session => {
              const otherUid = session.participants.find(p => p !== user.uid);
              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={cn(
                    "w-full flex items-center space-x-4 p-4 rounded-3xl transition-all",
                    selectedSession?.id === session.id 
                      ? "bg-white border border-slate-200 shadow-sm" 
                      : "hover:bg-white/50 border border-transparent"
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">User {otherUid?.slice(0, 5)}</p>
                    <p className="text-xs text-slate-400 truncate">{session.lastMessage || 'Start a conversation'}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 bg-white",
        !selectedSession ? "hidden md:flex" : "flex"
      )}>
        {selectedSession ? (
          <>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    User {selectedSession.participants.find(p => p !== user.uid)?.slice(0, 5)}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              <AnimatePresence initial={false}>
                {currentMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      msg.senderUid === user.uid ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-6 py-3 rounded-[24px] text-sm leading-relaxed shadow-sm",
                      msg.senderUid === user.uid 
                        ? "bg-orange-600 text-white rounded-br-none" 
                        : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">
                      {formatDistanceToNow(msg.createdAt)} ago
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-slate-100">
              <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-3xl p-2 pl-6">
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="p-4 rounded-2xl bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-center items-center justify-center text-center p-12 opacity-20">
            <div className="space-y-4">
              <MessageSquare className="w-24 h-24 mx-auto text-slate-400" />
              <p className="text-xl font-bold tracking-tight text-slate-900 uppercase">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
