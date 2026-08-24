export type UserRole = 'OWNER' | 'ADMIN' | 'EMPLOYEE' | 'CLIENT';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  clientId?: string; // If role === 'CLIENT'
  employeeId?: string; // If role === 'EMPLOYEE'
}

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_PAYMENT';
export type ContractModel = 'QUANTITY' | 'CAMPAIGN' | 'CUSTOM';

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
  segment: string;
  logoUrl?: string;
  address?: string;
  notes?: string;
  status: ClientStatus;
  contractModel: ContractModel;
  monthlyFee: number;
  dueDay: number;
  contractedVideos: number;
  contractedPhotos: number;
  contractedCampaigns: number;
  extraVideoPrice: number;
  extraPhotoPrice: number;
  extraEventPrice: number;
  extraDailyPrice: number;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  roleTitle: string;
  department: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  assignedClientIds: string[];
  canManageFinance: boolean;
  canManageClients: boolean;
  createdAt: string;
}

export type CampaignStatus = 
  | 'PLANNING' 
  | 'IN_PRODUCTION' 
  | 'IN_REVIEW' 
  | 'WAITING_APPROVAL' 
  | 'COMPLETED' 
  | 'CANCELLED'
  | 'DELAYED';

export type CampaignStep = 
  | 'BRIEFING'
  | 'SCRIPT'
  | 'RECORDING'
  | 'EDITING'
  | 'REVIEW'
  | 'APPROVAL'
  | 'PUBLISHING';

export interface Campaign {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  contentCount: number;
  progressPct: number;
  status: CampaignStatus;
  currentStep: CampaignStep;
  assignedEmployeeIds: string[];
  assignedEmployeeNames: string[];
  createdAt: string;
}

export type TaskStatus = 
  | 'BACKLOG' 
  | 'PLANNED' 
  | 'IN_PRODUCTION' 
  | 'IN_REVIEW' 
  | 'CLIENT_REVIEW' 
  | 'APPROVED' 
  | 'PUBLISHED';

export type TaskType = 'VIDEO' | 'PHOTO' | 'DESIGN' | 'EVENT' | 'COPYWRITING' | 'CAMPAIGN_CONTENT';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskComment {
  id: string;
  taskId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  sizeBytes?: number;
  fileType: string;
}

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  campaignId?: string;
  campaignName?: string;
  title: string;
  description?: string;
  taskType: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  dueDate: string;
  isExtra: boolean;
  extraPrice: number;
  completedAt?: string;
  mediaUrl?: string; // Link do Google Drive / YouTube / MP4 para visualização
  rawFolderUrl?: string; // Link da pasta do Google Drive com arquivos brutos / fotos RAW
  scriptUrl?: string; // Link do Google Docs / Notion / PDF do roteiro
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  createdAt: string;
}

export type EventType = 
  | 'RECORDING' 
  | 'PRODUCTION' 
  | 'PHOTO' 
  | 'DELIVERY' 
  | 'FINANCIAL' 
  | 'MEETING' 
  | 'CAMPAIGN';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  location?: string;
  eventType: EventType;
  clientId?: string;
  clientName?: string;
  employeeId?: string;
  employeeName?: string;
  campaignId?: string;
  campaignName?: string;
  description?: string;
}

export type ServiceRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ServiceType = 'VIDEO' | 'PHOTO' | 'EVENT' | 'CAMPAIGN' | 'DAILY' | 'OTHER';

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: ServiceType;
  quantity: number;
  unitPrice: number;
  totalEstimated: number;
  desiredDate: string;
  description: string;
  notes?: string;
  status: ServiceRequestStatus;
  convertedTaskId?: string;
  eventLocation?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  requiresDrone?: boolean;
  videoFormat?: string;
  photoType?: string;
  createdAt: string;
  approvedAt?: string;
}

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isExtra: boolean;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  referenceMonth: number; // 1-12
  referenceYear: number;
  baseAmount: number;
  extrasAmount: number;
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  pixKey: string;
  pixQrCodeUrl: string;
  pixPayload: string;
  items: InvoiceItem[];
  paidAt?: string;
  createdAt: string;
}

export interface MonthlyReport {
  id: string;
  clientId: string;
  clientName: string;
  month: number;
  year: number;
  contractedVideos: number;
  usedVideos: number;
  extraVideos: number;
  totalVideos: number;
  contractedPhotos: number;
  usedPhotos: number;
  extraPhotos: number;
  totalPhotos: number;
  baseAmount: number;
  extrasAmount: number;
  totalAmount: number;
  campaignsCompleted: number;
  tasksCompleted: number;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget?: UserRole | 'ALL';
  title: string;
  message: string;
  link?: string;
  type: 'REQUEST' | 'TASK' | 'PAYMENT' | 'CAMPAIGN' | 'REPORT' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}
