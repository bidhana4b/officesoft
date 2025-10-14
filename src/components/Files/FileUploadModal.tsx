import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';
import { Project, ProjectFile, TeamMember } from '../../types';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: ProjectFile) => void;
  projects: Project[];
  currentUser: TeamMember;
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onSave, projects, currentUser }) => {
  const [file, setFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setProjectId('');
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const newFile: ProjectFile = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: '#', // Placeholder URL
      uploadedBy: currentUser,
      uploadedAt: new Date().toISOString(),
      version: 1,
      projectId: projectId || undefined,
    };
    onSave(newFile);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div variants={modalVariants} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Upload New File</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg"><X size={20} className="text-charcoal-600 dark:text-gray-400" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-accent-teal bg-accent-teal/10' : 'border-sand-300 dark:border-dark-600'}`}
                  onDrop={handleDrop}
                  onDragOver={(e) => handleDragEvents(e, true)}
                  onDragEnter={(e) => handleDragEvents(e, true)}
                  onDragLeave={(e) => handleDragEvents(e, false)}
                >
                  <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadCloud size={48} className="mx-auto text-charcoal-400 dark:text-gray-500" />
                    <p className="mt-4 text-lg font-medium text-charcoal-800 dark:text-gray-200">
                      {file ? file.name : 'Drag & drop a file here'}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-600 dark:text-gray-400">
                      or <span className="font-semibold text-accent-teal">click to browse</span>
                    </p>
                    {file && <p className="mt-2 text-xs text-charcoal-500">{Math.round(file.size / 1024)} KB</p>}
                  </label>
                </div>
                
                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Associate with Project (Optional)</label>
                  <select name="projectId" id="projectId" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                    <option value="">No specific project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600">Cancel</button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={!file} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft disabled:opacity-50 disabled:cursor-not-allowed">Upload File</motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
