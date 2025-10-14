import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Grid, List, MoreHorizontal, Download, Edit, Trash2, File as FileIcon, FileText, FileArchive, FileImage, FileAudio, FileVideo } from 'lucide-react';
import { ProjectFile, Project } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

interface FilesViewProps {
  files: ProjectFile[];
  projects: Project[];
  onCreateNew: () => void;
  onDelete: (fileId: string) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <FileImage className="text-accent-orange" />;
  if (type.startsWith('audio/')) return <FileAudio className="text-blue-500" />;
  if (type.startsWith('video/')) return <FileVideo className="text-purple-500" />;
  if (type === 'application/pdf') return <FileText className="text-red-500" />;
  if (type === 'application/zip' || type === 'application/x-rar-compressed') return <FileArchive className="text-yellow-500" />;
  return <FileIcon className="text-charcoal-500" />;
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileCard: React.FC<{ file: ProjectFile; index: number; onDelete: (id: string) => void }> = ({ file, index, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-5 border border-transparent dark:border-dark-600 hover:shadow-hover dark:hover:shadow-dark-hover transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-sand-100 dark:bg-dark-700 rounded-lg">
          {getFileIcon(file.type)}
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(o => !o)} className="p-2 text-charcoal-500 dark:text-gray-400 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg"><MoreHorizontal size={20} /></button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-700 rounded-xl shadow-lg z-10 p-2 border border-sand-200 dark:border-dark-600">
                <a href={file.url} download className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-charcoal-700 dark:text-gray-200"><Download size={16} /><span>Download</span></a>
                <button className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-charcoal-700 dark:text-gray-200"><Edit size={16} /><span>Rename</span></button>
                <button onClick={() => onDelete(file.id)} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-red-500 dark:text-red-400"><Trash2 size={16} /><span>Delete</span></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <h3 className="font-semibold text-charcoal-900 dark:text-white truncate mb-1" title={file.name}>{file.name}</h3>
      <p className="text-sm text-charcoal-600 dark:text-gray-400 mb-4">{formatBytes(file.size)}</p>
      <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-gray-500 border-t border-sand-200 dark:border-dark-600 pt-3">
        <div className="flex items-center space-x-2">
          <img src={file.uploadedBy.avatar} alt={file.uploadedBy.name} className="w-6 h-6 rounded-full" />
          <span>{file.uploadedBy.name.split(' ')[0]}</span>
        </div>
        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
};

export const FilesView: React.FC<FilesViewProps> = ({ files, projects, onCreateNew, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredFiles = useMemo(() => 
    files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [files, searchTerm]);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Files & Resources</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Central hub for all your project assets and documents.</p>
        </div>
        <motion.button onClick={onCreateNew} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2">
          <Plus size={20} />
          <span>Upload File</span>
        </motion.button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-4 border border-transparent dark:border-dark-600 flex items-center justify-between">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
          <input type="text" placeholder="Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-80 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal" />
        </div>
        <div className="flex items-center space-x-2 p-1 bg-sand-100 dark:bg-dark-700 rounded-lg">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-dark-800 text-accent-teal shadow' : 'text-charcoal-500'}`}><Grid size={20} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-dark-800 text-accent-teal shadow' : 'text-charcoal-500'}`}><List size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <AnimatePresence>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file, index) => (
                <FileCard key={file.id} file={file} index={index} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-sand-200 dark:border-dark-600 bg-sand-50 dark:bg-dark-900/50">
                    <th className="p-4 text-sm font-medium text-charcoal-500 dark:text-gray-400">Name</th>
                    <th className="p-4 text-sm font-medium text-charcoal-500 dark:text-gray-400">Uploaded By</th>
                    <th className="p-4 text-sm font-medium text-charcoal-500 dark:text-gray-400">Date</th>
                    <th className="p-4 text-sm font-medium text-charcoal-500 dark:text-gray-400">Size</th>
                    <th className="p-4 text-sm font-medium text-charcoal-500 dark:text-gray-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file, index) => (
                    <motion.tr key={file.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-sand-100 dark:border-dark-700 last:border-b-0 hover:bg-sand-50 dark:hover:bg-dark-700/50">
                      <td className="p-4 font-medium text-charcoal-800 dark:text-gray-200 flex items-center space-x-3">
                        <span className="flex-shrink-0">{getFileIcon(file.type)}</span>
                        <span className="truncate">{file.name}</span>
                      </td>
                      <td className="p-4 text-charcoal-600 dark:text-gray-400">{file.uploadedBy.name}</td>
                      <td className="p-4 text-charcoal-600 dark:text-gray-400">{new Date(file.uploadedAt).toLocaleDateString()}</td>
                      <td className="p-4 text-charcoal-600 dark:text-gray-400">{formatBytes(file.size)}</td>
                      <td className="p-4 text-right"><button className="p-2 text-charcoal-500 dark:text-gray-400 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg"><MoreHorizontal size={20} /></button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
