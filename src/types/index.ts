export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'draft';
  client: string;
  team: TeamMember[];
  progress: number;
  deadline: string;
  budget: number;
  tags: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  assignee: TeamMember;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId: string;
  comments: Comment[];
  attachments: File[];
}

export interface TeamMember {
  id: string;
  name:string;
  role: string;
  avatar: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  department: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  contactPerson: {
    name: string;
    title: string;
  };
  email: string;
  phone: string;
  status: 'active' | 'onboarding' | 'churned';
  activeProjects: number;
  totalBilled: number;
  services: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: TeamMember;
  createdAt: string;
  replies?: Comment[];
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: TeamMember;
  uploadedAt: string;
  version: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  type: 'meeting' | 'deadline' | 'review' | 'other';
  attendees: TeamMember[];
  projectId?: string;
}

export interface IncomeTransaction {
  id: string;
  description: string;
  amount: number;
  sector: 'Web Development' | 'Branding' | 'Consulting' | 'Other';
  fund: 'Main Account' | 'Tax Fund' | 'Savings';
  date: string;
}

export interface ExpenseTransaction {
  id: string;
  description: string;
  amount: number;
  category: 'Software' | 'Salaries' | 'Utilities' | 'Marketing' | 'Other';
  date: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  accentColor: string;
  backgroundColor: string;
  logoUrl?: string;
  footerText?: string;
}

export interface Invoice {
  id: string; 
  clientId: string;
  client: Client;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  templateId?: string;
}

export interface ChatMessage {
  id: string;
  sender: TeamMember;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: TeamMember[];
  messages: ChatMessage[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}
