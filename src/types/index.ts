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
  attachments: ProjectFile[];
}

export interface TeamMember {
  id: string;
  name:string;
  role: string;
  avatar: string;
  email: string;
  phone?: string;
  status: 'online' | 'offline' | 'away';
  department: string;
  userRole: 'admin' | 'client_manager' | 'ad_manager';
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
  // For Ad Management
  adBalanceUSD?: number;
  avgDepositRate?: number; // BDT per USD
}

export interface Comment {
  id: string;
  content: string;
  author: TeamMember;
  createdAt: string;
  replies?: Comment[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: TeamMember;
  uploadedAt: string;
  version: number;
  projectId?: string;
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

export interface Fund {
    id: string;
    name: string;
    balance: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string; // e.g., 'Web Development', 'Branding', 'Software', 'Salaries'
  fundId: string;
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

// --- Ad Management System Types ---

export type AdPlatform = {
  id: 'facebook' | 'google' | 'tiktok';
  name: string;
  icon: React.ComponentType<any>;
};

export type AdAccount = {
  id: string;
  name: string;
  platformId: AdPlatform['id'];
  balanceUSD: number;
  avgCostPerUSD: number; // Average BDT cost to acquire 1 USD in this account
};

export type AdAccountRecharge = {
  id: string;
  adAccountId: string;
  amountUSD: number;
  costBDT: number;
  ratePerUSD: number;
  rechargeDate: string;
};

export type ClientAdTransaction = {
  id: string;
  clientId: string;
  type: 'deposit' | 'spend';
  amountBDT?: number; // Only for deposits
  amountUSD: number;
  ratePerUSD?: number; // Only for deposits
  transactionDate: string;
  campaignId?: string; // For spend transactions
};

export type Campaign = {
  id: string;
  name: string;
  clientId: string;
  platformId: AdPlatform['id'];
  status: 'pending' | 'running' | 'completed' | 'cancelled';
  requestedById: string; // User ID of Client Manager
  assignedToId?: string; // User ID of Ad Manager
  budgetUSD: number;
  actualSpendUSD?: number;
  adAccountId?: string;
  audienceDetails: string;
  reportUrl?: string; // Link to screenshot/report
  createdAt: string;
  completedAt?: string;
  profit?: number; // BDT
};
