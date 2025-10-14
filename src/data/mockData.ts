import { Project, TeamMember, Task, CalendarEvent, Client, IncomeTransaction, ExpenseTransaction, Invoice, InvoiceTemplate, Conversation, Note, ProjectFile } from '../types';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face',
    email: 'sarah@studio.com',
    phone: '555-0101',
    status: 'online',
    department: 'Design'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Lead Developer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    email: 'marcus@studio.com',
    phone: '555-0102',
    status: 'online',
    department: 'Development'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    email: 'emma@studio.com',
    phone: '555-0103',
    status: 'away',
    department: 'Design'
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    email: 'james@studio.com',
    phone: '555-0104',
    status: 'online',
    department: 'Management'
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    role: 'Senior Designer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    email: 'olivia@studio.com',
    phone: '555-0105',
    status: 'online',
    department: 'Design'
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'david@studio.com',
    phone: '555-0106',
    status: 'away',
    department: 'Development'
  },
  {
    id: '7',
    name: 'Lisa Zhang',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    email: 'lisa@studio.com',
    phone: '555-0107',
    status: 'online',
    department: 'Design'
  },
  {
    id: '8',
    name: 'Alex Johnson',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'alex@studio.com',
    phone: '555-0108',
    status: 'offline',
    department: 'Development'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Luxury Resort Rebrand',
    description: 'Complete brand identity redesign for premium resort chain',
    status: 'active',
    client: 'Ocean Vista Resorts',
    team: [mockTeamMembers[0], mockTeamMembers[2], mockTeamMembers[4]],
    progress: 65,
    deadline: '2025-03-15',
    budget: 85000,
    tags: ['Branding', 'Luxury', 'Hospitality'],
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    name: 'FinTech Mobile App',
    description: 'User-friendly mobile banking application for modern users',
    status: 'active',
    client: 'NextGen Financial',
    team: [mockTeamMembers[1], mockTeamMembers[3], mockTeamMembers[6]],
    progress: 45,
    deadline: '2025-04-20',
    budget: 120000,
    tags: ['Mobile', 'FinTech', 'UX'],
    createdAt: '2025-01-05'
  },
  {
    id: '3',
    name: 'E-commerce Platform',
    description: 'Custom e-commerce solution for fashion retailer',
    status: 'completed',
    client: 'Style Collective',
    team: [mockTeamMembers[1], mockTeamMembers[5], mockTeamMembers[7]],
    progress: 100,
    deadline: '2025-01-30',
    budget: 95000,
    tags: ['E-commerce', 'Fashion', 'Web'],
    createdAt: '2024-11-15'
  },
  {
    id: '4',
    name: 'Corporate Website Redesign',
    description: 'Modern website redesign for technology company',
    status: 'active',
    client: 'TechCorp Solutions',
    team: [mockTeamMembers[4], mockTeamMembers[5]],
    progress: 30,
    deadline: '2025-05-10',
    budget: 75000,
    tags: ['Web', 'Corporate', 'Responsive'],
    createdAt: '2025-01-20'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design logo concepts',
    description: 'Create 3 initial logo concepts for the resort rebrand',
    status: 'completed',
    assignee: mockTeamMembers[0],
    priority: 'high',
    dueDate: '2025-02-01',
    projectId: '1',
    comments: [],
    attachments: []
  },
  {
    id: '2',
    title: 'Develop color palette',
    description: 'Establish brand color system and guidelines',
    status: 'in-progress',
    assignee: mockTeamMembers[2],
    priority: 'medium',
    dueDate: '2025-02-10',
    projectId: '1',
    comments: [],
    attachments: []
  },
  {
    id: '3',
    title: 'Mobile app wireframes',
    description: 'Create wireframes for key app screens',
    status: 'todo',
    assignee: mockTeamMembers[2],
    priority: 'high',
    dueDate: '2025-02-15',
    projectId: '2',
    comments: [],
    attachments: []
  },
  {
    id: '4',
    title: 'User research analysis',
    description: 'Analyze user feedback and create insights report',
    status: 'review',
    assignee: mockTeamMembers[4],
    priority: 'medium',
    dueDate: '2025-02-12',
    projectId: '2',
    comments: [],
    attachments: []
  },
  {
    id: '5',
    title: 'Database schema design',
    description: 'Design database structure for the new platform',
    status: 'in-progress',
    assignee: mockTeamMembers[1],
    priority: 'high',
    dueDate: '2025-02-08',
    projectId: '3',
    comments: [],
    attachments: []
  },
  {
    id: '6',
    title: 'API documentation',
    description: 'Create comprehensive API documentation',
    status: 'todo',
    assignee: mockTeamMembers[7],
    priority: 'low',
    dueDate: '2025-02-20',
    projectId: '4',
    comments: [],
    attachments: []
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Client Review Meeting',
    description: 'Present logo concepts to Ocean Vista team',
    start: '2025-02-05T10:00:00',
    end: '2025-02-05T11:30:00',
    type: 'meeting',
    attendees: [mockTeamMembers[0], mockTeamMembers[3]],
    projectId: '1'
  },
  {
    id: '2',
    title: 'Design System Deadline',
    description: 'Complete design system documentation',
    start: '2025-02-10T17:00:00',
    end: '2025-02-10T17:00:00',
    type: 'deadline',
    attendees: [mockTeamMembers[2]],
    projectId: '1'
  },
  {
    id: '3',
    title: 'Team Standup',
    description: 'Weekly team sync meeting',
    start: '2025-02-07T09:00:00',
    end: '2025-02-07T10:00:00',
    type: 'meeting',
    attendees: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[2], mockTeamMembers[3]]
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Innovate Inc.',
    logo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop',
    contactPerson: { name: 'Elena Vance', title: 'CEO' },
    email: 'elena.vance@innovate.com',
    phone: '555-0101',
    status: 'active',
    activeProjects: 3,
    totalBilled: 150000,
    services: ['Branding', 'Web Dev', 'SEO']
  },
  {
    id: '2',
    name: 'QuantumLeap Corp.',
    logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
    contactPerson: { name: 'Liam Foster', title: 'Marketing Director' },
    email: 'liam.foster@quantumleap.com',
    phone: '555-0102',
    status: 'active',
    activeProjects: 2,
    totalBilled: 95000,
    services: ['Mobile App', 'UX/UI Design']
  },
  {
    id: '3',
    name: 'Artisan Goods',
    logo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop',
    contactPerson: { name: 'Nora Chen', title: 'Founder' },
    email: 'nora.chen@artisan.com',
    phone: '555-0103',
    status: 'onboarding',
    activeProjects: 1,
    totalBilled: 10000,
    services: ['E-commerce', 'Photography']
  },
  {
    id: '4',
    name: 'HealthPlus Clinics',
    logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop',
    contactPerson: { name: 'Dr. Marcus Thorne', title: 'Medical Director' },
    email: 'marcus.thorne@healthplus.com',
    phone: '555-0104',
    status: 'active',
    activeProjects: 4,
    totalBilled: 220000,
    services: ['Web Dev', 'Content Strategy']
  },
  {
    id: '5',
    name: 'Vertex Solutions',
    logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
    contactPerson: { name: 'Sofia Reyes', title: 'COO' },
    email: 'sofia.reyes@vertex.com',
    phone: '555-0105',
    status: 'churned',
    activeProjects: 0,
    totalBilled: 80000,
    services: ['Consulting']
  }
];

export const mockIncomeTransactions: IncomeTransaction[] = [
  { id: 'inc-1', description: 'Project payment from Innovate Inc.', amount: 25000, sector: 'Web Development', fund: 'Main Account', date: '2025-02-15' },
  { id: 'inc-2', description: 'QuantumLeap monthly retainer', amount: 7500, sector: 'Consulting', fund: 'Main Account', date: '2025-02-10' },
  { id: 'inc-3', description: 'Artisan Goods branding deposit', amount: 5000, sector: 'Branding', fund: 'Tax Fund', date: '2025-02-05' },
];

export const mockExpenseTransactions: ExpenseTransaction[] = [
  { id: 'exp-1', description: 'Figma Subscription', amount: 600, category: 'Software', date: '2025-02-01' },
  { id: 'exp-2', description: 'February Salaries', amount: 45000, category: 'Salaries', date: '2025-02-28' },
  { id: 'exp-3', description: 'WeWork Office Space', amount: 3200, category: 'Utilities', date: '2025-02-01' },
  { id: 'exp-4', description: 'Google Ads Campaign', amount: 1500, category: 'Marketing', date: '2025-02-20' },
];

export const mockInvoiceTemplates: InvoiceTemplate[] = [
  {
    id: 'template-1',
    name: 'Default Teal',
    accentColor: '#4A9B8E',
    backgroundColor: '#FFFFFF',
    logoUrl: 'https://i.imgur.com/p2Q4KxN.png', // A generic logo
    footerText: 'Thank you for your business. Please contact us with any questions.',
  },
  {
    id: 'template-2',
    name: 'Midnight Blue',
    accentColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
    logoUrl: 'https://i.imgur.com/p2Q4KxN.png',
    footerText: 'Payment is due within 30 days. Late fees may apply.',
  },
  {
    id: 'template-3',
    name: 'Charcoal Dark',
    accentColor: '#D2691E',
    backgroundColor: '#1E1E1E',
    logoUrl: 'https://i.imgur.com/p2Q4KxN.png',
    footerText: 'We appreciate your partnership.',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2025-001',
    clientId: '1',
    client: mockClients[0],
    issueDate: '2025-02-20',
    dueDate: '2025-03-20',
    status: 'paid',
    lineItems: [
      { id: '1', description: 'Phase 1: Discovery & Strategy', quantity: 1, price: 15000 },
      { id: '2', description: 'Phase 2: Initial Design Concepts', quantity: 1, price: 20000 },
    ],
    notes: 'Thank you for your business!',
    templateId: 'template-1',
  },
  {
    id: 'INV-2025-002',
    clientId: '2',
    client: mockClients[1],
    issueDate: '2025-02-25',
    dueDate: '2025-03-25',
    status: 'sent',
    lineItems: [
      { id: '1', description: 'Mobile App UI/UX Design Retainer', quantity: 1, price: 12000 },
    ],
    templateId: 'template-2',
  },
  {
    id: 'INV-2025-003',
    clientId: '4',
    client: mockClients[3],
    issueDate: '2025-03-01',
    dueDate: '2025-03-15',
    status: 'draft',
    lineItems: [
      { id: '1', description: 'Website Development - Milestone 1', quantity: 1, price: 25000 },
      { id: '2', description: 'Content Strategy Workshop', quantity: 4, price: 1200 },
    ],
    notes: 'Awaiting final approval before sending.',
    templateId: 'template-3',
  }
];

export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Q1 Marketing Strategy',
    content: '## Brainstorming Session Notes\n\n- **Target Audience:** Focus on millennials and Gen Z for the new campaign.\n- **Channels:** Instagram Reels, TikTok, and influencer collaborations.\n- **Key Messaging:** "Effortless Creativity, Powerful Results."\n\n### Action Items\n\n1.  [ ] Finalize influencer list\n2.  [ ] Draft campaign brief\n3.  [ ] Set up tracking metrics',
    updatedAt: '2025-03-10T14:48:00.000Z',
  },
  {
    id: 'note-2',
    title: 'Client Feedback - NextGen',
    content: '### Feedback from the last review call:\n\n- They love the onboarding flow.\n- Request to change the primary button color to a slightly brighter shade of blue.\n- Want to see a dashboard prototype by next week.',
    updatedAt: '2025-03-09T11:23:00.000Z',
  },
  {
    id: 'note-3',
    title: 'Component Library Ideas',
    content: 'Thinking about building a new date picker component. \n\n**Requirements:**\n- Range selection\n- Keyboard accessible\n- Customizable theme',
    updatedAt: '2025-03-08T18:00:00.000Z',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [mockTeamMembers[0], mockTeamMembers[1]],
    messages: [
      { id: 'msg-1', sender: mockTeamMembers[1], content: 'Hey Sarah, how is the resort rebrand project going?', timestamp: '2025-03-11T09:30:00.000Z' },
      { id: 'msg-2', sender: mockTeamMembers[0], content: 'Hi Marcus! Going well. Just finishing up the initial logo concepts. Should be ready for review this afternoon.', timestamp: '2025-03-11T09:31:00.000Z' },
      { id: 'msg-3', sender: mockTeamMembers[1], content: 'Great to hear! Let me know if you need any input from the dev side.', timestamp: '2025-03-11T09:32:00.000Z' },
    ],
  },
  {
    id: 'conv-2',
    participants: [mockTeamMembers[0], mockTeamMembers[3]],
    messages: [
      { id: 'msg-4', sender: mockTeamMembers[3], content: 'Meeting with TechCorp is confirmed for Thursday at 2 PM.', timestamp: '2025-03-10T16:05:00.000Z' },
      { id: 'msg-5', sender: mockTeamMembers[0], content: 'Thanks, James. I\'ve added it to the calendar.', timestamp: '2025-03-10T16:10:00.000Z' },
    ],
  },
  {
    id: 'conv-3',
    participants: [mockTeamMembers[0], mockTeamMembers[2]],
    messages: [
      { id: 'msg-6', sender: mockTeamMembers[2], content: 'Can you take a look at the wireframes for the FinTech app when you have a moment?', timestamp: '2025-03-12T11:00:00.000Z' },
      { id: 'msg-7', sender: mockTeamMembers[0], content: 'Of course, send them over!', timestamp: '2025-03-12T11:01:00.000Z' },
    ],
  },
];

export const mockFiles: ProjectFile[] = [
  {
    id: 'file-1',
    name: 'Brand_Guidelines_v2.pdf',
    type: 'application/pdf',
    size: 5242880, // 5MB
    url: '#',
    uploadedBy: mockTeamMembers[0],
    uploadedAt: '2025-03-10T10:00:00Z',
    version: 2,
    projectId: '1'
  },
  {
    id: 'file-2',
    name: 'Homepage_Mockup_Desktop.fig',
    type: 'image/figma',
    size: 12582912, // 12MB
    url: '#',
    uploadedBy: mockTeamMembers[2],
    uploadedAt: '2025-03-09T14:30:00Z',
    version: 1,
    projectId: '4'
  },
  {
    id: 'file-3',
    name: 'User_Flow_Diagram.png',
    type: 'image/png',
    size: 1048576, // 1MB
    url: '#',
    uploadedBy: mockTeamMembers[6],
    uploadedAt: '2025-03-08T11:00:00Z',
    version: 3,
    projectId: '2'
  },
  {
    id: 'file-4',
    name: 'Q1_Marketing_Assets.zip',
    type: 'application/zip',
    size: 26214400, // 25MB
    url: '#',
    uploadedBy: mockTeamMembers[3],
    uploadedAt: '2025-03-07T16:45:00Z',
    version: 1,
  },
    {
    id: 'file-5',
    name: 'API_Specification.docx',
    type: 'application/msword',
    size: 786432, // 768KB
    url: '#',
    uploadedBy: mockTeamMembers[1],
    uploadedAt: '2025-03-06T09:20:00Z',
    version: 1,
    projectId: '3'
  }
];
