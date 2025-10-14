import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, StickyNote, PlusCircle, MessageCircle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { mockConversations, mockNotes, mockTeamMembers } from '../../data/mockData';
import { Conversation, Note, ChatMessage, TeamMember } from '../../types';
import { ChatWindow } from './ChatWindow';
import { NoteEditor } from './NoteEditor';
import { NewChatModal } from './NewChatModal';

interface ChatViewProps {
  currentUser: TeamMember;
}

export const ChatView: React.FC<ChatViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'notes'>('chats');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', mockConversations);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', mockNotes);
  const [teamMembers] = useLocalStorage<TeamMember[]>('teamMembers', mockTeamMembers);

  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    if (activeTab === 'chats') {
      return conversations.find(c => c.id === selectedItemId);
    }
    return notes.find(n => n.id === selectedItemId);
  }, [selectedItemId, activeTab, conversations, notes]);

  const filteredConversations = useMemo(() => 
    conversations.filter(c => 
      c.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [conversations, searchTerm]);

  const filteredNotes = useMemo(() =>
    notes.filter(n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    ), [notes, searchTerm]);

  const handleSendMessage = (content: string) => {
    if (!selectedItemId || activeTab !== 'chats') return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: currentUser,
      content,
      timestamp: new Date().toISOString(),
    };

    setConversations(prev => prev.map(c => 
      c.id === selectedItemId ? { ...c, messages: [...c.messages, newMessage] } : c
    ));
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(n =>
      n.id === updatedNote.id ? updatedNote : n
    ));
  };
  
  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    setSelectedItemId(null);
  };

  const handleDeleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    setSelectedItemId(null);
  };

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveTab('notes');
    setSelectedItemId(newNote.id);
  };

  const handleStartChat = (user: TeamMember) => {
    setIsNewChatModalOpen(false);
    // Check if a conversation with this user already exists
    const existingConv = conversations.find(c => 
      c.participants.length === 2 && c.participants.some(p => p.id === user.id)
    );

    if (existingConv) {
      setSelectedItemId(existingConv.id);
    } else {
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        participants: [currentUser, user],
        messages: [],
      };
      setConversations(prev => [newConv, ...prev]);
      setSelectedItemId(newConv.id);
    }
    setActiveTab('chats');
  };

  return (
    <div className="flex h-full bg-sand-50 dark:bg-dark-950">
      {/* Sidebar */}
      <aside className="w-96 h-full flex flex-col bg-white dark:bg-dark-800 border-r border-sand-200 dark:border-dark-600">
        <div className="p-4 border-b border-sand-200 dark:border-dark-600">
          <h2 className="text-large font-semibold text-charcoal-900 dark:text-white mb-4">Chat & Notes</h2>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal"
            />
          </div>
        </div>
        <div className="p-2 bg-sand-50 dark:bg-dark-900">
          <div className="flex bg-sand-100 dark:bg-dark-700 rounded-lg p-1">
            <button onClick={() => setActiveTab('chats')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'chats' ? 'bg-white dark:bg-dark-800 shadow-sm text-accent-teal' : 'text-charcoal-600 dark:text-gray-400'}`}>
              <MessageSquare size={16} className="inline mr-2" />Chats
            </button>
            <button onClick={() => setActiveTab('notes')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'notes' ? 'bg-white dark:bg-dark-800 shadow-sm text-accent-teal' : 'text-charcoal-600 dark:text-gray-400'}`}>
              <StickyNote size={16} className="inline mr-2" />Notes
            </button>
          </div>
        </div>
        <div className="p-2 border-b border-sand-200 dark:border-dark-600">
          <div className="flex space-x-2">
            <button onClick={() => setIsNewChatModalOpen(true)} className="w-1/2 text-center p-2 rounded-lg flex items-center justify-center space-x-2 transition-colors bg-sand-100 dark:bg-dark-700 hover:bg-sand-200 dark:hover:bg-dark-600">
              <MessageCircle size={16} className="text-accent-teal" />
              <span className="font-medium text-sm text-accent-teal">New Chat</span>
            </button>
            <button onClick={handleCreateNewNote} className="w-1/2 text-center p-2 rounded-lg flex items-center justify-center space-x-2 transition-colors bg-sand-100 dark:bg-dark-700 hover:bg-sand-200 dark:hover:bg-dark-600">
              <PlusCircle size={16} className="text-accent-teal" />
              <span className="font-medium text-sm text-accent-teal">New Note</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === 'chats' ? (
                <div className="p-2 space-y-1">
                  {filteredConversations.map(conv => {
                    const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
                    const lastMessage = conv.messages[conv.messages.length - 1];
                    return (
                      <button key={conv.id} onClick={() => setSelectedItemId(conv.id)} className={`w-full text-left p-3 rounded-xl flex items-center space-x-3 transition-colors ${selectedItemId === conv.id ? 'bg-accent-teal/10 dark:bg-accent-teal/20' : 'hover:bg-sand-100 dark:hover:bg-dark-700'}`}>
                        <img src={otherParticipant?.avatar} alt={otherParticipant?.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-medium text-charcoal-800 dark:text-gray-200 truncate">{otherParticipant?.name}</p>
                          <p className="text-sm text-charcoal-500 dark:text-gray-400 truncate">{lastMessage ? `${lastMessage.sender.id === currentUser.id ? 'You: ' : ''}${lastMessage.content}` : 'No messages yet'}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredNotes.map(note => (
                    <button key={note.id} onClick={() => setSelectedItemId(note.id)} className={`w-full text-left p-3 rounded-xl transition-colors ${selectedItemId === note.id ? 'bg-accent-teal/10 dark:bg-accent-teal/20' : 'hover:bg-sand-100 dark:hover:bg-dark-700'}`}>
                      <p className="font-medium text-charcoal-800 dark:text-gray-200 truncate">{note.title}</p>
                      <p className="text-sm text-charcoal-500 dark:text-gray-400">Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {!selectedItem && (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-charcoal-500 dark:text-gray-500">
              <MessageSquare size={48} className="mb-4" />
              <h3 className="text-lg font-medium">Select a chat or note</h3>
              <p>Your conversations and notes will appear here.</p>
            </motion.div>
          )}

          {selectedItem && activeTab === 'chats' && (
            <ChatWindow key={selectedItem.id} conversation={selectedItem as Conversation} currentUser={currentUser} onSendMessage={handleSendMessage} onDelete={handleDeleteConversation} />
          )}

          {selectedItem && activeTab === 'notes' && (
            <NoteEditor key={selectedItem.id} note={selectedItem as Note} onUpdateNote={handleUpdateNote} onDelete={handleDeleteNote} />
          )}
        </AnimatePresence>
      </main>
      
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectUser={handleStartChat}
        teamMembers={teamMembers}
        currentUser={currentUser}
      />
    </div>
  );
};
