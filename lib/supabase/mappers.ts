import { Client, Employee, Task, ServiceRequest, Campaign, CalendarEvent, Invoice } from '@/lib/types';

// ==========================================
// CLIENT MAPPERS
// ==========================================
export function mapDbToClient(db: any): Client {
  return {
    id: db.id,
    name: db.name || '',
    companyName: db.company_name || db.name || '',
    email: db.email || '',
    username: db.username || '',
    password: db.initial_password || '',
    phone: db.phone || '',
    document: db.document || '',
    segment: db.segment || '',
    logoUrl: db.logo_url || '',
    address: db.address || '',
    notes: db.notes || '',
    status: db.status || 'ACTIVE',
    contractModel: db.contract_model || 'QUANTITY',
    monthlyFee: Number(db.monthly_fee) || 0,
    dueDay: Number(db.due_day) || 10,
    contractedVideos: Number(db.contracted_videos) || 0,
    contractedPhotos: Number(db.contracted_photos) || 0,
    contractedCampaigns: Number(db.contracted_campaigns) || 0,
    extraVideoPrice: Number(db.extra_video_price) || 150,
    extraPhotoPrice: Number(db.extra_photo_price) || 80,
    extraEventPrice: Number(db.extra_event_price) || 500,
    extraDailyPrice: Number(db.extra_daily_price) || 300,
    createdAt: db.created_at ? db.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function mapClientToDb(c: Partial<Client>): any {
  const db: any = {};
  if (c.name !== undefined) db.name = c.name;
  if (c.companyName !== undefined) db.company_name = c.companyName;
  if (c.email !== undefined) db.email = c.email;
  if (c.username !== undefined) db.username = c.username;
  if (c.password !== undefined) db.initial_password = c.password;
  if (c.phone !== undefined) db.phone = c.phone;
  if (c.document !== undefined) db.document = c.document;
  if (c.segment !== undefined) db.segment = c.segment;
  if (c.logoUrl !== undefined) db.logo_url = c.logoUrl;
  if (c.address !== undefined) db.address = c.address;
  if (c.notes !== undefined) db.notes = c.notes;
  if (c.status !== undefined) db.status = c.status;
  if (c.contractModel !== undefined) db.contract_model = c.contractModel;
  if (c.monthlyFee !== undefined) db.monthly_fee = c.monthlyFee;
  if (c.dueDay !== undefined) db.due_day = c.dueDay;
  if (c.contractedVideos !== undefined) db.contracted_videos = c.contractedVideos;
  if (c.contractedPhotos !== undefined) db.contracted_photos = c.contractedPhotos;
  if (c.contractedCampaigns !== undefined) db.contracted_campaigns = c.contractedCampaigns;
  if (c.extraVideoPrice !== undefined) db.extra_video_price = c.extraVideoPrice;
  if (c.extraPhotoPrice !== undefined) db.extra_photo_price = c.extraPhotoPrice;
  if (c.extraEventPrice !== undefined) db.extra_event_price = c.extraEventPrice;
  if (c.extraDailyPrice !== undefined) db.extra_daily_price = c.extraDailyPrice;
  return db;
}

// ==========================================
// EMPLOYEE MAPPERS
// ==========================================
export function mapDbToEmployee(db: any): Employee {
  return {
    id: db.id,
    name: db.name || '',
    email: db.email || '',
    username: db.username || '',
    password: db.initial_password || '',
    phone: db.phone || '',
    avatarUrl: db.avatar_url || '',
    roleTitle: db.role_title || 'Videomaker',
    department: db.department || 'Produção',
    status: db.status || 'ACTIVE',
    assignedClientIds: [],
    canManageFinance: Boolean(db.can_manage_finance),
    canManageClients: Boolean(db.can_manage_clients),
    salary: Number(db.salary) || 0,
    createdAt: db.created_at ? db.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function mapEmployeeToDb(e: Partial<Employee>): any {
  const db: any = {};
  if (e.name !== undefined) db.name = e.name;
  if (e.email !== undefined) db.email = e.email;
  if (e.username !== undefined) db.username = e.username;
  if (e.password !== undefined) db.initial_password = e.password;
  if (e.phone !== undefined) db.phone = e.phone;
  if (e.avatarUrl !== undefined) db.avatar_url = e.avatarUrl;
  if (e.roleTitle !== undefined) db.role_title = e.roleTitle;
  if (e.department !== undefined) db.department = e.department;
  if (e.status !== undefined) db.status = e.status;
  if (e.canManageFinance !== undefined) db.can_manage_finance = e.canManageFinance;
  if (e.canManageClients !== undefined) db.can_manage_clients = e.canManageClients;
  return db;
}

// ==========================================
// TASK MAPPERS
// ==========================================
export function mapDbToTask(db: any, clientName?: string, assigneeName?: string): Task {
  return {
    id: db.id,
    clientId: db.client_id,
    clientName: clientName || 'Cliente',
    campaignId: db.campaign_id,
    assigneeId: db.assignee_id,
    assigneeName: assigneeName,
    title: db.title,
    description: db.description || '',
    taskType: db.task_type || 'VIDEO',
    status: db.status || 'BACKLOG',
    priority: db.priority || 'MEDIUM',
    dueDate: db.due_date,
    isExtra: Boolean(db.is_extra),
    extraPrice: Number(db.extra_price) || 0,
    mediaUrl: db.media_url,
    rawFolderUrl: db.raw_folder_url,
    scriptUrl: db.script_url,
    completedAt: db.completed_at,
    createdAt: db.created_at ? db.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function mapTaskToDb(t: Partial<Task>): any {
  const db: any = {};
  if (t.clientId !== undefined) db.client_id = t.clientId;
  if (t.campaignId !== undefined) db.campaign_id = t.campaignId;
  if (t.assigneeId !== undefined) db.assignee_id = t.assigneeId;
  if (t.title !== undefined) db.title = t.title;
  if (t.description !== undefined) db.description = t.description;
  if (t.taskType !== undefined) db.task_type = t.taskType;
  if (t.status !== undefined) db.status = t.status;
  if (t.priority !== undefined) db.priority = t.priority;
  if (t.dueDate !== undefined) db.due_date = t.dueDate;
  if (t.isExtra !== undefined) db.is_extra = t.isExtra;
  if (t.extraPrice !== undefined) db.extra_price = t.extraPrice;
  if (t.mediaUrl !== undefined) db.media_url = t.mediaUrl;
  if (t.rawFolderUrl !== undefined) db.raw_folder_url = t.rawFolderUrl;
  if (t.scriptUrl !== undefined) db.script_url = t.scriptUrl;
  if (t.completedAt !== undefined) db.completed_at = t.completedAt;
  return db;
}

// ==========================================
// SERVICE REQUEST MAPPERS
// ==========================================
export function mapDbToRequest(db: any, clientName?: string): ServiceRequest {
  return {
    id: db.id,
    clientId: db.client_id,
    clientName: clientName || 'Cliente',
    serviceType: db.service_type || 'VIDEO',
    quantity: Number(db.quantity) || 1,
    unitPrice: Number(db.unit_price) || 150,
    totalEstimated: Number(db.total_estimated) || 150,
    desiredDate: db.desired_date,
    description: db.description || '',
    notes: db.notes,
    status: db.status || 'PENDING',
    convertedTaskId: db.converted_task_id,
    eventLocation: db.event_location,
    eventStartTime: db.event_start_time,
    eventEndTime: db.event_end_time,
    requiresDrone: Boolean(db.requires_drone),
    createdAt: db.created_at ? db.created_at.replace('T', ' ').substring(0, 16) : 'Recente',
    approvedAt: db.approved_at,
  };
}

export function mapRequestToDb(r: Partial<ServiceRequest>): any {
  const db: any = {};
  if (r.clientId !== undefined) db.client_id = r.clientId;
  if (r.serviceType !== undefined) db.service_type = r.serviceType;
  if (r.quantity !== undefined) db.quantity = r.quantity;
  if (r.unitPrice !== undefined) db.unit_price = r.unitPrice;
  if (r.totalEstimated !== undefined) db.total_estimated = r.totalEstimated;
  if (r.desiredDate !== undefined) db.desired_date = r.desiredDate;
  if (r.description !== undefined) db.description = r.description;
  if (r.notes !== undefined) db.notes = r.notes;
  if (r.status !== undefined) db.status = r.status;
  if (r.convertedTaskId !== undefined) db.converted_task_id = r.convertedTaskId;
  if (r.eventLocation !== undefined) db.event_location = r.eventLocation;
  if (r.eventStartTime !== undefined) db.event_start_time = r.eventStartTime;
  if (r.eventEndTime !== undefined) db.event_end_time = r.eventEndTime;
  if (r.requiresDrone !== undefined) db.requires_drone = r.requiresDrone;
  if (r.approvedAt !== undefined) db.approved_at = r.approvedAt;
  return db;
}

// ==========================================
// CAMPAIGN MAPPERS
// ==========================================
export function mapDbToCampaign(db: any, clients?: Client[]): Campaign {
  const client = clients?.find((c) => c.id === db.client_id);
  return {
    id: db.id,
    clientId: db.client_id,
    clientName: client?.name || 'Cliente',
    name: db.name || '',
    description: db.description || '',
    startDate: db.start_date,
    endDate: db.end_date,
    budget: Number(db.budget) || 0,
    contentCount: Number(db.content_count) || 0,
    progressPct: Number(db.progress_pct) || 0,
    status: db.status || 'PLANNING',
    currentStep: db.current_step || 'BRIEFING',
    assignedEmployeeIds: db.assigned_employee_ids || [],
    assignedEmployeeNames: db.assigned_employee_names || [],
    createdAt: db.created_at ? db.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function mapCampaignToDb(c: Partial<Campaign>): any {
  const db: any = {};
  if (c.clientId !== undefined) db.client_id = c.clientId;
  if (c.name !== undefined) db.name = c.name;
  if (c.description !== undefined) db.description = c.description;
  if (c.startDate !== undefined) db.start_date = c.startDate;
  if (c.endDate !== undefined) db.end_date = c.endDate;
  if (c.budget !== undefined) db.budget = c.budget;
  if (c.contentCount !== undefined) db.content_count = c.contentCount;
  if (c.progressPct !== undefined) db.progress_pct = c.progressPct;
  if (c.status !== undefined) db.status = c.status;
  if (c.currentStep !== undefined) db.current_step = c.currentStep;
  return db;
}

// ==========================================
// CALENDAR EVENT MAPPERS
// ==========================================
export function mapDbToCalendarEvent(db: any, clients?: Client[]): CalendarEvent {
  const client = clients?.find((c) => c.id === db.client_id);
  return {
    id: db.id,
    clientId: db.client_id || '',
    clientName: client?.name || '',
    title: db.title || '',
    date: db.event_date,
    startTime: db.start_time || '',
    endTime: db.end_time || '',
    location: db.location || '',
    eventType: db.event_type || 'RECORDING',
    description: db.description || '',
  };
}

export function mapCalendarEventToDb(e: Partial<CalendarEvent>): any {
  const db: any = {};
  if (e.clientId !== undefined) db.client_id = e.clientId || null;
  if (e.title !== undefined) db.title = e.title;
  if (e.date !== undefined) db.event_date = e.date;
  if (e.startTime !== undefined) db.start_time = e.startTime || null;
  if (e.endTime !== undefined) db.end_time = e.endTime || null;
  if (e.location !== undefined) db.location = e.location;
  if (e.eventType !== undefined) db.event_type = e.eventType;
  if (e.description !== undefined) db.description = e.description;
  return db;
}

// ==========================================
// INVOICE MAPPERS
// ==========================================
export function mapDbToInvoice(db: any, clients?: Client[]): Invoice {
  const client = clients?.find((c) => c.id === db.client_id);
  return {
    id: db.id,
    clientId: db.client_id,
    clientName: client?.name || 'Cliente',
    referenceMonth: Number(db.reference_month),
    referenceYear: Number(db.reference_year),
    baseAmount: Number(db.base_amount) || 0,
    extrasAmount: Number(db.extras_amount) || 0,
    totalAmount: Number(db.total_amount) || 0,
    dueDate: db.due_date,
    status: db.status || 'PENDING',
    pixKey: db.pix_key || '',
    pixQrCodeUrl: db.pix_qr_code_url || '',
    pixPayload: db.pix_payload || '',
    paidAt: db.paid_at,
    items: [],
    createdAt: db.created_at ? db.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function mapInvoiceToDb(inv: Partial<Invoice>): any {
  const db: any = {};
  if (inv.clientId !== undefined) db.client_id = inv.clientId;
  if (inv.referenceMonth !== undefined) db.reference_month = inv.referenceMonth;
  if (inv.referenceYear !== undefined) db.reference_year = inv.referenceYear;
  if (inv.baseAmount !== undefined) db.base_amount = inv.baseAmount;
  if (inv.extrasAmount !== undefined) db.extras_amount = inv.extrasAmount;
  if (inv.totalAmount !== undefined) db.total_amount = inv.totalAmount;
  if (inv.dueDate !== undefined) db.due_date = inv.dueDate;
  if (inv.status !== undefined) db.status = inv.status;
  if (inv.pixKey !== undefined) db.pix_key = inv.pixKey;
  if (inv.pixPayload !== undefined) db.pix_payload = inv.pixPayload;
  if (inv.paidAt !== undefined) db.paid_at = inv.paidAt;
  return db;
}
