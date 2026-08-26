'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Client, Employee, Campaign, Task, TaskStatus,
  CalendarEvent, ServiceRequest, Invoice,
  MonthlyReport, NotificationItem,
} from '../types';
import {
  mockClients, mockEmployees, mockCampaigns, mockTasks,
  mockCalendarEvents, mockServiceRequests, mockInvoices,
  mockMonthlyReports, mockNotifications,
} from '../data/mockData';
import {
  fetchInitialDataFromSupabase,
  syncClientToSupabase, deleteClientFromSupabase,
  syncEmployeeToSupabase,
  syncTaskToSupabase, deleteTaskFromSupabase,
  syncCampaignToSupabase, deleteCampaignFromSupabase,
  syncCalendarEventToSupabase, deleteCalendarEventFromSupabase,
  syncRequestToSupabase,
  syncInvoiceToSupabase,
  syncProfileToSupabase,
} from '@/lib/supabase/syncService';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface SystemStoreContextType {
  clients: Client[];
  employees: Employee[];
  campaigns: Campaign[];
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  serviceRequests: ServiceRequest[];
  invoices: Invoice[];
  monthlyReports: MonthlyReport[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastMessage[];
  isLoadingData: boolean;

  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addTaskComment: (taskId: string, content: string, authorName: string, authorRole: string) => void;

  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveServiceRequest: (requestId: string) => void;
  rejectServiceRequest: (requestId: string) => void;

  markInvoiceAsPaid: (invoiceId: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;

  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  adminWhatsApp: string;
  updateAdminWhatsApp: (phone: string) => void;
  pixKey: string;
  updatePixKey: (key: string) => void;
  pixBeneficiary: string;
  updatePixBeneficiary: (name: string) => void;
}

const SystemStoreContext = createContext<SystemStoreContextType | undefined>(undefined);

export function SystemStoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [adminWhatsApp, setAdminWhatsApp] = useState<string>('(16) 99123-4567');
  const [pixKey, setPixKey] = useState<string>('financeiro@brutalmarketing.com.br');
  const [pixBeneficiary, setPixBeneficiary] = useState<string>('Brutal Marketing Ltda');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [monthlyReports] = useState<MonthlyReport[]>(mockMonthlyReports);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ────────────────────────────────────────────────────────────
  // BOOT — load from Supabase (source of truth)
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    // Restore settings from localStorage
    try {
      const wa = localStorage.getItem('brutal_admin_whatsapp');
      if (wa) setAdminWhatsApp(wa);
      const pk = localStorage.getItem('brutal_pix_key');
      if (pk) setPixKey(pk);
      const pb = localStorage.getItem('brutal_pix_beneficiary');
      if (pb) setPixBeneficiary(pb);
    } catch {}

    // Fetch all live data from Supabase
    fetchInitialDataFromSupabase().then((cloudData) => {
      if (cloudData) {
        if (cloudData.clients.length > 0) setClients(cloudData.clients);
        if (cloudData.employees.length > 0) setEmployees(cloudData.employees);
        if (cloudData.campaigns.length > 0) setCampaigns(cloudData.campaigns);
        if (cloudData.tasks.length > 0) setTasks(cloudData.tasks);
        if (cloudData.serviceRequests.length > 0) setServiceRequests(cloudData.serviceRequests);
        if (cloudData.calendarEvents.length > 0) setCalendarEvents(cloudData.calendarEvents);
        if (cloudData.invoices.length > 0) setInvoices(cloudData.invoices);
      }
      setIsLoadingData(false);
    });
  }, []);

  // ────────────────────────────────────────────────────────────
  // SETTINGS
  // ────────────────────────────────────────────────────────────
  const updateAdminWhatsApp = (phone: string) => {
    setAdminWhatsApp(phone);
    try { localStorage.setItem('brutal_admin_whatsapp', phone); } catch {}
    addToast({ title: 'WhatsApp do Admin Atualizado', description: `Notificações serão enviadas para ${phone}.`, type: 'success' });
  };
  const updatePixKey = (key: string) => {
    setPixKey(key);
    try { localStorage.setItem('brutal_pix_key', key); } catch {}
  };
  const updatePixBeneficiary = (name: string) => {
    setPixBeneficiary(name);
    try { localStorage.setItem('brutal_pix_beneficiary', name); } catch {}
  };

  // ────────────────────────────────────────────────────────────
  // TOASTS
  // ────────────────────────────────────────────────────────────
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // ────────────────────────────────────────────────────────────
  // CLIENTS
  // ────────────────────────────────────────────────────────────
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    syncClientToSupabase(newClient);
    // Sync login profile so client can log in from any device
    if (newClient.email && newClient.password) {
      syncProfileToSupabase({
        id: `prof-cli-${newClient.id}`,
        email: newClient.email,
        username: newClient.username || newClient.email.split('@')[0],
        password: newClient.password,
        fullName: newClient.name,
        role: 'CLIENT',
        clientId: newClient.id,
      });
    }
    addToast({ title: 'Cliente Cadastrado', description: `${newClient.name} adicionado com sucesso.`, type: 'success' });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      const modified = updated.find((c) => c.id === id);
      if (modified) syncClientToSupabase(modified);
      return updated;
    });
    addToast({ title: 'Cliente Atualizado', description: 'As alterações foram salvas.', type: 'info' });
  };

  const deleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    deleteClientFromSupabase(id);
    addToast({ title: 'Cliente Removido', description: `${client?.name || 'Cliente'} removido.`, type: 'warning' });
  };

  // ────────────────────────────────────────────────────────────
  // EMPLOYEES
  // ────────────────────────────────────────────────────────────
  const addEmployee = (empData: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmp: Employee = {
      ...empData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [...prev, newEmp]);
    syncEmployeeToSupabase(newEmp);
    // Sync login profile so employee can log in from any device
    if (newEmp.email && newEmp.password) {
      syncProfileToSupabase({
        id: `prof-emp-${newEmp.id}`,
        email: newEmp.email,
        username: newEmp.username || newEmp.email.split('@')[0],
        password: newEmp.password,
        fullName: newEmp.name,
        role: 'EMPLOYEE',
        employeeId: newEmp.id,
      });
    }
    addToast({ title: 'Funcionário Cadastrado', description: `${newEmp.name} adicionado à equipe.`, type: 'success' });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      const modified = updated.find((e) => e.id === id);
      if (modified) syncEmployeeToSupabase(modified);
      return updated;
    });
    addToast({ title: 'Equipe Atualizada', description: 'Dados do colaborador atualizados.', type: 'info' });
  };

  // ────────────────────────────────────────────────────────────
  // TASKS
  // ────────────────────────────────────────────────────────────
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    syncTaskToSupabase(newTask);
    setNotifications((prev) => [{
      id: `notif-${Date.now()}`,
      roleTarget: 'STAFF',
      title: 'Nova Tarefa Criada',
      message: `Tarefa "${newTask.title}" adicionada para ${newTask.clientName}.`,
      link: '/producao',
      type: 'TASK',
      isRead: false,
      createdAt: 'Agora mesmo',
    }, ...prev]);
    addToast({ title: 'Tarefa Criada', description: `"${newTask.title}" adicionada ao Kanban.`, type: 'success' });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      const modified = updated.find((t) => t.id === id);
      if (modified) syncTaskToSupabase(modified);
      return updated;
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    let taskName = 'Conteúdo';
    let clientName = 'Cliente';
    let clientId = '';

    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;
      taskName = task.title;
      clientName = task.clientName;
      clientId = task.clientId;

      const completedAt =
        ['APPROVED', 'PUBLISHED'].includes(newStatus) && !task.completedAt
          ? new Date().toISOString()
          : task.completedAt;
      const updated = prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, completedAt } : t));
      const modified = updated.find((t) => t.id === taskId);
      if (modified) syncTaskToSupabase(modified);
      return updated;
    });

    if (newStatus === 'APPROVED') {
      // Notification specifically for STAFF / ADMIN (NOT for client)
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          roleTarget: 'ADMIN',
          title: '🎬 Vídeo Aprovado pelo Cliente!',
          message: `${clientName} aprovou "${taskName}". Pronto para publicação e agendamento!`,
          link: '/producao',
          type: 'APPROVAL',
          isRead: false,
          createdAt: 'Agora mesmo',
        },
        ...prev,
      ]);
      addToast({
        title: 'Vídeo Aprovado! 🎉',
        description: `"${taskName}" foi aprovado com sucesso!`,
        type: 'success',
      });
    } else if (newStatus === 'CLIENT_REVIEW') {
      // Notification specifically for CLIENT
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          roleTarget: 'CLIENT',
          clientId: clientId,
          title: '🎬 Novo Vídeo Disponível para Sua Aprovação!',
          message: `O vídeo "${taskName}" está pronto para sua revisão na central de entregas.`,
          link: '/portal-cliente/entregas',
          type: 'APPROVAL',
          isRead: false,
          createdAt: 'Agora mesmo',
        },
        ...prev,
      ]);
    } else if (newStatus === 'PUBLISHED') {
      addToast({
        title: 'Conteúdo Publicado! 🚀',
        description: 'Entrega computada na cota do cliente.',
        type: 'success',
      });
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    deleteTaskFromSupabase(id);
    addToast({ title: 'Tarefa Excluída', type: 'info' });
  };

  const addTaskComment = (taskId: string, content: string, authorName: string, authorRole: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      taskId,
      authorName,
      authorRole,
      content,
      createdAt: 'Agora mesmo',
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const comments = t.comments ? [...t.comments, newComment] : [newComment];
          return { ...t, comments };
        }
        return t;
      })
    );
  };

  // ────────────────────────────────────────────────────────────
  // CAMPAIGNS
  // ────────────────────────────────────────────────────────────
  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    syncCampaignToSupabase(newCamp);
    addToast({ title: 'Campanha Iniciada', description: `"${newCamp.name}" adicionada com sucesso.`, type: 'success' });
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      const modified = updated.find((c) => c.id === id);
      if (modified) syncCampaignToSupabase(modified);
      return updated;
    });
    addToast({ title: 'Campanha Atualizada', description: 'Progresso salvo.', type: 'info' });
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    deleteCampaignFromSupabase(id);
    addToast({ title: 'Campanha Removida', type: 'warning' });
  };

  // ────────────────────────────────────────────────────────────
  // CALENDAR EVENTS
  // ────────────────────────────────────────────────────────────
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...eventData, id: crypto.randomUUID() };
    setCalendarEvents((prev) => [...prev, newEvent]);
    syncCalendarEventToSupabase(newEvent);
    addToast({ title: 'Evento Agendado', description: `${newEvent.title} em ${newEvent.date}.`, type: 'success' });
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      const modified = updated.find((e) => e.id === id);
      if (modified) syncCalendarEventToSupabase(modified);
      return updated;
    });
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    deleteCalendarEventFromSupabase(id);
    addToast({ title: 'Evento Removido', type: 'info' });
  };

  // ────────────────────────────────────────────────────────────
  // SERVICE REQUESTS
  // ────────────────────────────────────────────────────────────
  const addServiceRequest = (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: crypto.randomUUID(),
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setServiceRequests((prev) => [newRequest, ...prev]);
    syncRequestToSupabase(newRequest);
    setNotifications((prev) => [{
      id: `notif-${Date.now()}`,
      roleTarget: 'ADMIN',
      title: 'Nova Solicitação de Extra',
      message: `${newRequest.clientName} solicitou ${newRequest.quantity}x ${newRequest.serviceType} (R$ ${newRequest.totalEstimated}).`,
      link: '/solicitacoes',
      type: 'REQUEST',
      isRead: false,
      createdAt: 'Agora mesmo',
    }, ...prev]);
    addToast({ title: 'Solicitação Enviada', description: 'Aguardando aprovação do Admin.', type: 'success' });
  };

  const approveServiceRequest = (requestId: string) => {
    const req = serviceRequests.find((r) => r.id === requestId);
    if (!req) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      clientId: req.clientId,
      clientName: req.clientName,
      title: req.serviceType === 'EVENT'
        ? `[EVENTO EXTRA] Cobertura: ${req.description.substring(0, 45)}`
        : `[EXTRA] ${req.quantity}x ${req.serviceType} - ${req.description.substring(0, 40)}`,
      description: `${req.description}${req.eventLocation ? ` | Local: ${req.eventLocation}` : ''}${req.requiresDrone ? ' | [Requer Drone]' : ''}`,
      taskType: req.serviceType === 'VIDEO' ? 'VIDEO' : req.serviceType === 'PHOTO' ? 'PHOTO' : 'EVENT',
      status: 'PLANNED',
      priority: 'HIGH',
      dueDate: req.desiredDate,
      isExtra: true,
      extraPrice: req.totalEstimated,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    syncTaskToSupabase(newTask);

    if (req.serviceType === 'EVENT' || req.serviceType === 'DAILY' || req.eventLocation) {
      const newCalEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        clientId: req.clientId,
        clientName: req.clientName,
        title: req.serviceType === 'EVENT' ? `Cobertura Evento: ${req.clientName}` : `Gravação Extra: ${req.clientName}`,
        date: req.desiredDate,
        startTime: req.eventStartTime || '09:00',
        endTime: req.eventEndTime || '18:00',
        location: req.eventLocation || 'Presencial / Externa',
        eventType: req.serviceType === 'PHOTO' ? 'PHOTO' : 'RECORDING',
        description: `Serviço extra: ${req.description}`,
      };
      setCalendarEvents((prev) => [...prev, newCalEvent]);
      syncCalendarEventToSupabase(newCalEvent);
    }

    const updatedReqs = serviceRequests.map((r) =>
      r.id === requestId
        ? { ...r, status: 'APPROVED' as const, convertedTaskId: newTask.id, approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) }
        : r
    );
    setServiceRequests(updatedReqs);
    const updatedReq = updatedReqs.find((r) => r.id === requestId);
    if (updatedReq) syncRequestToSupabase(updatedReq);

    // Notify client that extra was approved
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        roleTarget: 'CLIENT',
        clientId: req.clientId,
        title: '⚡ Solicitação de Extra Aprovada!',
        message: `Sua solicitação de ${req.quantity}x ${req.serviceType} foi aprovada e adicionada à esteira de produção.`,
        link: '/portal-cliente/solicitacoes',
        type: 'REQUEST',
        isRead: false,
        createdAt: 'Agora mesmo',
      },
      ...prev,
    ]);

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.clientId === req.clientId && inv.referenceMonth === new Date().getMonth() + 1) {
          const updated = { ...inv, extrasAmount: inv.extrasAmount + req.totalEstimated, totalAmount: inv.baseAmount + inv.extrasAmount + req.totalEstimated };
          syncInvoiceToSupabase(updated);
          return updated;
        }
        return inv;
      })
    );
    addToast({ title: 'Solicitação Aprovada!', description: `R$ ${req.totalEstimated} adicionado ao faturamento do mês.`, type: 'success' });
  };

  const rejectServiceRequest = (requestId: string) => {
    const updated = serviceRequests.map((r) => r.id === requestId ? { ...r, status: 'REJECTED' as const } : r);
    setServiceRequests(updated);
    const rejected = updated.find((r) => r.id === requestId);
    if (rejected) syncRequestToSupabase(rejected);
    addToast({ title: 'Solicitação Recusada', type: 'info' });
  };

  // ────────────────────────────────────────────────────────────
  // INVOICES
  // ────────────────────────────────────────────────────────────
  const markInvoiceAsPaid = (invoiceId: string) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'PAID' as const, paidAt: new Date().toISOString().split('T')[0] } : inv
      );
      const modified = updated.find((i) => i.id === invoiceId);
      if (modified) syncInvoiceToSupabase(modified);
      return updated;
    });
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (invoice) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          roleTarget: 'ADMIN',
          title: 'Pagamento Confirmado',
          message: `Fatura de ${invoice.clientName} (R$ ${invoice.totalAmount}) foi quitada via PIX.`,
          link: '/financeiro',
          type: 'PAYMENT',
          isRead: false,
          createdAt: 'Agora mesmo',
        },
        {
          id: `notif-${Date.now() + 1}`,
          roleTarget: 'CLIENT',
          clientId: invoice.clientId,
          title: '✓ Pagamento Confirmado com Sucesso',
          message: `Confirmamos o recebimento do pagamento da sua fatura de R$ ${invoice.totalAmount}. Muito obrigado!`,
          link: '/portal-cliente',
          type: 'PAYMENT',
          isRead: false,
          createdAt: 'Agora mesmo',
        },
        ...prev,
      ]);
    }
    addToast({ title: 'Pagamento Confirmado! 💸', description: 'Fatura atualizada para PAGO.', type: 'success' });
  };

  const createInvoice = (invData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInv: Invoice = { ...invData, id: crypto.randomUUID(), createdAt: new Date().toISOString().split('T')[0] };
    setInvoices((prev) => [newInv, ...prev]);
    syncInvoiceToSupabase(newInv);
    addToast({ title: 'Fatura Gerada', description: `Fatura de R$ ${newInv.totalAmount} emitida para ${newInv.clientName}.`, type: 'success' });
  };

  // ────────────────────────────────────────────────────────────
  // NOTIFICATIONS
  // ────────────────────────────────────────────────────────────
  const markNotificationAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  const markAllNotificationsAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SystemStoreContext.Provider
      value={{
        clients, employees, campaigns, tasks, calendarEvents,
        serviceRequests, invoices, monthlyReports, notifications,
        unreadNotificationCount, toasts, isLoadingData,
        addToast, removeToast,
        addClient, updateClient, deleteClient,
        addEmployee, updateEmployee,
        addTask, updateTask, updateTaskStatus, deleteTask, addTaskComment,
        addCampaign, updateCampaign, deleteCampaign,
        addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
        addServiceRequest, approveServiceRequest, rejectServiceRequest,
        markInvoiceAsPaid, createInvoice,
        markNotificationAsRead, markAllNotificationsAsRead,
        adminWhatsApp, updateAdminWhatsApp,
        pixKey, updatePixKey,
        pixBeneficiary, updatePixBeneficiary,
      }}
    >
      {children}
    </SystemStoreContext.Provider>
  );
}

export function useSystemStore() {
  const context = useContext(SystemStoreContext);
  if (!context) throw new Error('useSystemStore must be used within a SystemStoreProvider');
  return context;
}
