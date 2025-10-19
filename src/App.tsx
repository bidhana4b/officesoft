import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectList } from './components/Projects/ProjectList';
import { TaskBoard } from './components/Tasks/TaskBoard';
import { TeamDirectory } from './components/Team/TeamDirectory';
import { ClientView } from './components/Client/ClientView';
import { FinanceView } from './components/Finance/FinanceView';
import { InvoicingView } from './components/Invoicing/InvoicingView';
import { InvoiceTemplatesView } from './components/Invoicing/InvoiceTemplatesView';
import { ChatView } from './components/Chat/ChatView';
import { CalendarView } from './components/Calendar/CalendarView';
import { FilesView } from './components/Files/FilesView';
import { SettingsView } from './components/Settings/SettingsView';
import { AdManagerView } from './components/AdManager/AdManagerView';
import { ProjectFormModal } from './components/Projects/ProjectFormModal';
import { TaskFormModal } from './components/Tasks/TaskFormModal';
import { TeamMemberFormModal } from './components/Team/TeamMemberFormModal';
import { FileUploadModal } from './components/Files/FileUploadModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Project, Task, TeamMember, ProjectFile } from './types';
import { mockProjects, mockTeamMembers, mockTasks, mockFiles } from './data/mockData';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [projects, setProjects] = useLocalStorage<Project[]>('projects', mockProjects);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', mockTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<'todo' | 'in-progress' | 'review' | 'completed'>('todo');

  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', mockTeamMembers);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  const [files, setFiles] = useLocalStorage<ProjectFile[]>('files', mockFiles);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

  const currentUser = teamMembers.find(m => m.id === '1')!;

  // Project Handlers
  const handleOpenNewProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };
  const handleOpenEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };
  const handleCloseProjectModal = () => setIsProjectModalOpen(false);
  const handleSaveProject = (projectToSave: Project) => {
    setProjects(prev => prev.some(p => p.id === projectToSave.id) ? prev.map(p => p.id === projectToSave.id ? projectToSave : p) : [projectToSave, ...prev]);
    handleCloseProjectModal();
  };

  // Task Handlers
  const handleOpenNewTaskModal = (status: 'todo' | 'in-progress' | 'review' | 'completed' = 'todo') => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setIsTaskModalOpen(true);
  };
  const handleOpenEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  const handleCloseTaskModal = () => setIsTaskModalOpen(false);
  const handleSaveTask = (taskToSave: Task) => {
    setTasks(prev => prev.some(t => t.id === taskToSave.id) ? prev.map(t => t.id === taskToSave.id ? taskToSave : t) : [taskToSave, ...prev]);
    handleCloseTaskModal();
  };
  const handleTaskStatusChange = (taskId: string, newStatus: 'todo' | 'in-progress' | 'review' | 'completed') => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  // Team Member Handlers
  const handleOpenNewTeamMemberModal = () => {
    setEditingTeamMember(null);
    setIsTeamMemberModalOpen(true);
  };
  const handleOpenEditTeamMemberModal = (member: TeamMember) => {
    setEditingTeamMember(member);
    setIsTeamMemberModalOpen(true);
  };
  const handleCloseTeamMemberModal = () => setIsTeamMemberModalOpen(false);
  const handleSaveTeamMember = (memberToSave: TeamMember) => {
    setTeamMembers(prev => prev.some(m => m.id === memberToSave.id) ? prev.map(m => m.id === memberToSave.id ? memberToSave : m) : [memberToSave, ...prev]);
    handleCloseTeamMemberModal();
  };
  const handleUpdateCurrentUser = (user: TeamMember) => {
    handleSaveTeamMember(user);
  };

  // File Handlers
  const handleOpenFileUploadModal = () => setIsFileUploadModalOpen(true);
  const handleCloseFileUploadModal = () => setIsFileUploadModalOpen(false);
  const handleSaveFile = (fileToSave: ProjectFile) => {
    setFiles(prev => [fileToSave, ...prev]);
    handleCloseFileUploadModal();
  };
  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard projects={projects} tasks={tasks} />;
      case 'projects': return <ProjectList projects={projects} onCreateNew={handleOpenNewProjectModal} onEdit={handleOpenEditProjectModal} />;
      case 'tasks': return <TaskBoard tasks={tasks} teamMembers={teamMembers} projects={projects} onEditTask={handleOpenEditTaskModal} onCreateNewTask={handleOpenNewTaskModal} onTaskStatusChange={handleTaskStatusChange} />;
      case 'team': return <TeamDirectory teamMembers={teamMembers} onAddMember={handleOpenNewTeamMemberModal} onEditMember={handleOpenEditTeamMemberModal} />;
      case 'chat': return <ChatView currentUser={currentUser} />;
      case 'files': return <FilesView files={files} projects={projects} onCreateNew={handleOpenFileUploadModal} onDelete={handleDeleteFile} />;
      case 'calendar': return <CalendarView />;
      case 'client': return <ClientView />;
      case 'finance': return <FinanceView />;
      case 'invoicing': return <InvoicingView />;
      case 'invoice-templates': return <InvoiceTemplatesView />;
      case 'ad-management': return <AdManagerView />;
      case 'settings': return <SettingsView currentUser={currentUser} onUpdateUser={handleUpdateCurrentUser} />;
      default: return <Dashboard projects={projects} tasks={tasks} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-sand-50 dark:bg-dark-950 flex transition-colors duration-300">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          )}
        </AnimatePresence>

        <div className={`${isMobileMenuOpen ? 'fixed' : 'hidden'} lg:relative lg:block inset-y-0 left-0 z-50 lg:z-0`}>
          <Sidebar activeView={activeView} onViewChange={(view) => { setActiveView(view); setIsMobileMenuOpen(false); }} isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} currentUser={currentUser} onNewProjectClick={handleOpenNewProjectModal} />
          
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeView} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="h-full">
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <ProjectFormModal isOpen={isProjectModalOpen} onClose={handleCloseProjectModal} onSave={handleSaveProject} project={editingProject} />
        <TaskFormModal isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} onSave={handleSaveTask} task={editingTask} projects={projects} teamMembers={teamMembers} defaultStatus={defaultTaskStatus} />
        <TeamMemberFormModal isOpen={isTeamMemberModalOpen} onClose={handleCloseTeamMemberModal} onSave={handleSaveTeamMember} member={editingTeamMember} />
        <FileUploadModal isOpen={isFileUploadModalOpen} onClose={handleCloseFileUploadModal} onSave={handleSaveFile} projects={projects} currentUser={currentUser} />
      </div>
    </ThemeProvider>
  );
};

export default App;
