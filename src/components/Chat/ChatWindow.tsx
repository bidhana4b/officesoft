import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreHorizontal, Trash2 } from 'lucide-react';
import { Conversation, TeamMember } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: TeamMember;
  onSendMessage: (content: string) => void;
  onDelete: (conversationId: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage, onDelete }) => {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [conversation.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full">
      <header className="p-4 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between bg-white dark:bg-dark-800">
        <div className="flex items-center space-x-3">
          <img src={otherParticipant?.avatar} alt={otherParticipant?.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-charcoal-900 dark:text-white">{otherParticipant?.name}</p>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(o => !o)} className="p-2 text-charcoal-500 dark:text-gray-400 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
            <MoreHorizontal size={20} />
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-xl shadow-lg z-10 p-2 border border-sand-200 dark:border-dark-600"
              >
                <button onClick={() => { onDelete(conversation.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-red-500 dark:text-red-400">
                  <Trash2 size={16} /><span>Delete Conversation</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {conversation.messages.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            {msg.sender.id !== currentUser.id && <img src={msg.sender.avatar} alt={msg.sender.name} className="w-8 h-8 rounded-full" />}
            <div className={`max-w-md p-3 rounded-2xl ${msg.sender.id === currentUser.id ? 'bg-accent-teal text-white rounded-br-none' : 'bg-white dark:bg-dark-700 rounded-bl-none'}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-dark-800 border-t border-sand-200 dark:border-dark-600">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full pr-12 pl-4 py-3 bg-sand-100 dark:bg-dark-700 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal-dark transition-colors">
            <Send size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};
