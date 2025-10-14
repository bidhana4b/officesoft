import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Note } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);
  
  const handleBlur = () => {
    if (content !== note.content || title !== note.title) {
      onUpdateNote({ ...note, title, content, updatedAt: new Date().toISOString() });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full">
      <header className="p-4 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between bg-white dark:bg-dark-800">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleBlur}
          className="text-lg font-semibold text-charcoal-900 dark:text-white bg-transparent focus:outline-none w-full"
          placeholder="Note Title"
        />
        <div className="flex items-center space-x-2">
          <p className="text-sm text-charcoal-500 dark:text-gray-400 whitespace-nowrap">
            Last updated: {new Date(note.updatedAt).toLocaleDateString()}
          </p>
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
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-700 rounded-xl shadow-lg z-10 p-2 border border-sand-200 dark:border-dark-600"
                >
                  <button onClick={() => { onDelete(note.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-red-500 dark:text-red-400">
                    <Trash2 size={16} /><span>Delete Note</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      <div className="flex-1 p-6">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onBlur={handleBlur}
          className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-charcoal-800 dark:text-gray-200 leading-relaxed"
          placeholder="Start writing your note..."
        />
      </div>
    </motion.div>
  );
};
