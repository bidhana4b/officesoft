import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mail, Phone, MoreHorizontal, FolderKanban, Edit, CheckCircle, XCircle } from 'lucide-react';
import { mockClients } from '../../data/mockData';
import { Client } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';
import { ClientFormModal } from './ClientFormModal';

interface ClientCardProps {
  client: Client;
  index: number;
  onEdit: (client: Client) => void;
  onStatusChange: (clientId: string, status: 'active' | 'churned') => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, index, onEdit, onStatusChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'onboarding': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'churned': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
    }
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft hover:shadow-hover dark:hover:shadow-dark-hover transition-all duration-300 p-6 border border-transparent dark:border-dark-600 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img src={client.logo} alt={`${client.name} logo`} className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <h3 className="font-semibold text-large text-charcoal-900 dark:text-white">{client.name}</h3>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium mt-1 inline-block ${getStatusColor(client.status)}`}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </span>
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
                <button onClick={() => handleMenuAction(() => onEdit(client))} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-charcoal-700 dark:text-gray-200">
                  <Edit size={16} /><span>Edit Client</span>
                </button>
                {client.status !== 'active' && (
                  <button onClick={() => handleMenuAction(() => onStatusChange(client.id, 'active'))} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-charcoal-700 dark:text-gray-200">
                    <CheckCircle size={16} className="text-green-500"/><span>Set as Active</span>
                  </button>
                )}
                {client.status !== 'churned' && (
                  <button onClick={() => handleMenuAction(() => onStatusChange(client.id, 'churned'))} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-charcoal-700 dark:text-gray-200">
                    <XCircle size={16} className="text-red-500"/><span>Set as Churned</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-sand-200 dark:border-dark-600 pt-4 mb-4">
        <p className="text-sm font-medium text-charcoal-800 dark:text-gray-200">{client.contactPerson.name}</p>
        <p className="text-xs text-charcoal-500 dark:text-gray-500 mb-3">{client.contactPerson.title}</p>
        <div className="flex items-center space-x-4 text-sm text-charcoal-600 dark:text-gray-400">
          <a href={`mailto:${client.email}`} className="flex items-center space-x-2 hover:text-accent-teal dark:hover:text-accent-teal-dark">
            <Mail size={14} />
            <span>Email</span>
          </a>
          <a href={`tel:${client.phone}`} className="flex items-center space-x-2 hover:text-accent-teal dark:hover:text-accent-teal-dark">
            <Phone size={14} />
            <span>Call</span>
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-sand-50 dark:bg-dark-700 p-3 rounded-lg">
          <p className="text-xs text-charcoal-500 dark:text-gray-400">Active Projects</p>
          <p className="text-lg font-bold text-charcoal-900 dark:text-white">{client.activeProjects}</p>
        </div>
        <div className="bg-sand-50 dark:bg-dark-700 p-3 rounded-lg">
          <p className="text-xs text-charcoal-500 dark:text-gray-400">Total Billed</p>
          <p className="text-lg font-bold text-charcoal-900 dark:text-white">${client.totalBilled.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-charcoal-800 dark:text-gray-200 mb-2">Services</p>
        <div className="flex flex-wrap gap-2">
          {client.services.map(service => (
            <span key={service} className="px-2 py-1 bg-sand-100 dark:bg-dark-700 text-charcoal-600 dark:text-gray-400 text-xs rounded-md font-medium">
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-sand-100 dark:bg-dark-700 text-charcoal-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-sand-200 dark:hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
        >
          <FolderKanban size={16} />
          <span>View Projects</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export const ClientView: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleAddNewClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveClient = (clientData: Client) => {
    setClients(prevClients => {
      const isEditing = prevClients.some(c => c.id === clientData.id);
      if (isEditing) {
        return prevClients.map(c => (c.id === clientData.id ? clientData : c));
      } else {
        return [clientData, ...prevClients];
      }
    });
    handleCloseModal();
  };

  const handleStatusChange = (clientId: string, status: 'active' | 'churned') => {
    setClients(clients.map(c => c.id === clientId ? { ...c, status } : c));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Client Management</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Oversee client relationships and project status</p>
        </div>
        
        <motion.button
          onClick={handleAddNewClient}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Client</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {clients.map((client, index) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              index={index} 
              onEdit={handleEditClient}
              onStatusChange={handleStatusChange}
            />
          ))}
        </AnimatePresence>
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        client={editingClient}
      />
    </div>
  );
};
