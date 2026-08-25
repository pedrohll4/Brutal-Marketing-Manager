'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Employee,
  Campaign,
  Task,
  TaskStatus,
  CalendarEvent,
  ServiceRequest,
  Invoice,
  MonthlyReport,
  NotificationItem,
} from '../types';
import {
  mockClients,
  mockEmployees,
  mockCampaigns,
  mockTasks,
  mockCalendarEvents,
  mockServiceRequests,
  mockInvoices,
  mockMonthlyReports,
  mockNotifications,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface SystemStoreContextType {
  // Data State
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

  // Toast actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Clients
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Employees
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;

  // Tasks / Kanban
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addTaskComment: (taskId: string, content: string, authorName: string, authorRole: string) => void;

  // Campaigns
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // Calendar
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Service Requests (Extras)
  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveServiceRequest: (requestId: string) => void;
  rejectServiceRequest: (requestId: string) => void;

  // Invoices & Payments
  markInvoiceAsPaid: (invoiceId: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // System & Admin Contact Settings
  adminWhatsApp: string;
  updateAdminWhatsApp: (phone: string) => void;
  pixKey: string;
  updatePixKey: (key: string) => void;
  pixBeneficiary: string;
  updatePixBeneficiary: (name: string) => void;
}

const SystemStoreContext = createContext<SystemStoreContextType | undefined>(undefined);

export function SystemStoreProvider({ children }: { children: React.ReactNode }) {
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
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>(mockMonthlyReports);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from local storage if available for session persistence
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('brutal_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      const savedRequests = localStorage.getItem('brutal_requests');
      if (savedRequests) setServiceRequests(JSON.parse(savedRequests));
      const savedInvoices = localStorage.getItem('brutal_invoices');
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedAdminWa = localStorage.getItem('brutal_admin_whatsapp');
      if (savedAdminWa) setAdminWhatsApp(savedAdminWa);

      const savedPixKey = localStorage.getItem('brutal_pix_key');
      if (savedPixKey) setPixKey(savedPixKey);

      const savedBeneficiary = localStorage.getItem('brutal_pix_beneficiary');
      if (savedBeneficiary) setPixBeneficiary(savedBeneficiary);
    } catch {
      // ignore
    }
  }, []);

  const updateAdminWhatsApp = (phone: string) => {
    setAdminWhatsApp(phone);
    try {
      localStorage.setItem('brutal_admin_whatsapp', phone);
    } catch {}
    addToast({
      title: 'WhatsApp do Admin Atualizado',
      description: `Notificações de solicitações serão enviadas para ${phone}.`,
      type: 'success',
    });
  };

  const updatePixKey = (key: string) => {
    setPixKey(key);
    try {
      localStorage.setItem('brutal_pix_key', key);
    } catch {}
  };

  const updatePixBeneficiary = (name: string) => {
    setPixBeneficiary(name);
    try {
      localStorage.setItem('brutal_pix_beneficiary', name);
    } catch {}
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Client Actions
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    addToast({
      title: 'Cliente Cadastrado',
      description: `${newClient.name} (${newClient.companyName}) foi adicionado com sucesso.`,
      type: 'success',
    });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast({
      title: 'Cliente Atualizado',
      description: 'As alterações foram salvas.',
      type: 'info',
    });
  };

  const deleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    addToast({
      title: 'Cliente Removido',
      description: `${client?.name || 'Cliente'} foi removido do sistema.`,
      type: 'warning',
    });
  };

  // Employee Actions
  const addEmployee = (empData: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [...prev, newEmp]);
    addToast({
      title: 'Funcionário Cadastrado',
      description: `${newEmp.name} foi adicionado à equipe.`,
      type: 'success',
    });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    addToast({
      title: 'Equipe Atualizada',
      description: 'Dados do colaborador foram atualizados.',
      type: 'info',
    });
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    try {
      localStorage.setItem('brutal_tasks', JSON.stringify(updated));
    } catch {}

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Nova Tarefa Criada',
      message: `Tarefa "${newTask.title}" adicionada para ${newTask.clientName}.`,
      link: '/producao',
      type: 'TASK',
      isRead: false,
      createdAt: 'Agora mesmo',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast({
      title: 'Tarefa Criada',
      description: `"${newTask.title}" adicionada ao Kanban.`,
      type: 'success',
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTasks(updated);
    try {
      localStorage.setItem('brutal_tasks', JSON.stringify(updated));
    } catch {}
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const completedAt =
      ['APPROVED', 'PUBLISHED'].includes(newStatus) && !task.completedAt
        ? new Date().toISOString()
        : task.completedAt;

    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus, completedAt } : t
    );
    setTasks(updated);
    try {
      localStorage.setItem('brutal_tasks', JSON.stringify(updated));
    } catch {}

    // Feedback
    if (newStatus === 'PUBLISHED') {
      addToast({
        title: 'Conteúdo Publicado! 🎉',
        description: `"${task.title}" finalizado e computado na cota de ${task.clientName}.`,
        type: 'success',
      });
    }
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    try {
      localStorage.setItem('brutal_tasks', JSON.stringify(updated));
    } catch {}
    addToast({
      title: 'Tarefa Excluída',
      type: 'info',
    });
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

  // Campaign Actions
  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    addToast({
      title: 'Campanha Iniciada',
      description: `"${newCamp.name}" adicionada com sucesso.`,
      type: 'success',
    });
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast({
      title: 'Campanha Atualizada',
      description: 'Progresso da campanha salvo.',
      type: 'info',
    });
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    addToast({
      title: 'Campanha Removida',
      type: 'warning',
    });
  };

  // Calendar Actions
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
    addToast({
      title: 'Evento Agendado',
      description: `${newEvent.title} em ${newEvent.date}.`,
      type: 'success',
    });
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    addToast({
      title: 'Evento Removido',
      type: 'info',
    });
  };

  // Service Requests (Extras)
  const addServiceRequest = (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    const updated = [newRequest, ...serviceRequests];
    setServiceRequests(updated);
    try {
      localStorage.setItem('brutal_requests', JSON.stringify(updated));
    } catch {}

    // Add notification to Admin
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Nova Solicitação de Extra',
      message: `${newRequest.clientName} solicitou ${newRequest.quantity}x ${newRequest.serviceType} (R$ ${newRequest.totalEstimated}).`,
      link: '/solicitacoes',
      type: 'REQUEST',
      isRead: false,
      createdAt: 'Agora mesmo',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast({
      title: 'Solicitação Enviada',
      description: 'Sua solicitação de serviço extra foi enviada para aprovação.',
      type: 'success',
    });
  };

  const approveServiceRequest = (requestId: string) => {
    const req = serviceRequests.find((r) => r.id === requestId);
    if (!req) return;

    // 1. Convert to a Kanban Task
    const newTask: Task = {
      id: `tsk-extra-${Date.now()}`,
      clientId: req.clientId,
      clientName: req.clientName,
      title: req.serviceType === 'EVENT'
        ? `[EVENTO EXTRA] Cobertura: ${req.description.substring(0, 45)}`
        : `[EXTRA] ${req.quantity}x ${req.serviceType} - ${req.description.substring(0, 40)}`,
      description: `${req.description}${req.eventLocation ? ` | Local: ${req.eventLocation}` : ''}${req.requiresDrone ? ' | [Requer Drone/Imagens Aéreas]' : ''}`,
      taskType: req.serviceType === 'VIDEO' ? 'VIDEO' : req.serviceType === 'PHOTO' ? 'PHOTO' : 'EVENT',
      status: 'PLANNED',
      priority: 'HIGH',
      dueDate: req.desiredDate,
      isExtra: true,
      extraPrice: req.totalEstimated,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks((prev) => [newTask, ...prev]);

    // 1.1 If it's an Event or has location/hours, automatically schedule in the Calendar!
    if (req.serviceType === 'EVENT' || req.serviceType === 'DAILY' || req.eventLocation) {
      const newCalEvent: CalendarEvent = {
        id: `evt-extra-${Date.now()}`,
        clientId: req.clientId,
        clientName: req.clientName,
        title: req.serviceType === 'EVENT' ? `Cobertura Evento: ${req.clientName}` : `Gravação Extra: ${req.clientName}`,
        date: req.desiredDate,
        startTime: req.eventStartTime || '09:00',
        endTime: req.eventEndTime || '18:00',
        location: req.eventLocation || 'Presencial / Externa',
        eventType: req.serviceType === 'PHOTO' ? 'PHOTO' : req.serviceType === 'EVENT' ? 'RECORDING' : 'PRODUCTION',
        description: `Serviço extra solicitado pelo cliente: ${req.description}`,
      };
      setCalendarEvents((prev) => [...prev, newCalEvent]);
    }

    // 2. Mark request as approved
    const updatedRequests = serviceRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'APPROVED' as const,
            convertedTaskId: newTask.id,
            approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        : r
    );
    setServiceRequests(updatedRequests);
    try {
      localStorage.setItem('brutal_requests', JSON.stringify(updatedRequests));
    } catch {}

    // 3. Update or generate invoice with extra
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.clientId === req.clientId && inv.referenceMonth === 8) {
          const newExtrasAmount = inv.extrasAmount + req.totalEstimated;
          const newTotal = inv.baseAmount + newExtrasAmount;
          return {
            ...inv,
            extrasAmount: newExtrasAmount,
            totalAmount: newTotal,
            items: [
              ...inv.items,
              {
                description: `Serviço Extra Aprovado (${req.quantity}x ${req.serviceType})`,
                quantity: req.quantity,
                unitPrice: req.unitPrice,
                total: req.totalEstimated,
                isExtra: true,
              },
            ],
          };
        }
        return inv;
      })
    );

    addToast({
      title: 'Solicitação Aprovada!',
      description: `Tarefa gerada no Kanban e R$ ${req.totalEstimated} adicionado ao faturamento do mês.`,
      type: 'success',
    });
  };

  const rejectServiceRequest = (requestId: string) => {
    const updated = serviceRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'REJECTED' as const } : r
    );
    setServiceRequests(updated);
    try {
      localStorage.setItem('brutal_requests', JSON.stringify(updated));
    } catch {}
    addToast({
      title: 'Solicitação Recusada',
      type: 'info',
    });
  };

  // Invoices
  const markInvoiceAsPaid = (invoiceId: string) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId
        ? {
            ...inv,
            status: 'PAID' as const,
            paidAt: new Date().toISOString().split('T')[0],
          }
        : inv
    );
    setInvoices(updated);
    try {
      localStorage.setItem('brutal_invoices', JSON.stringify(updated));
    } catch {}

    const invoice = invoices.find((i) => i.id === invoiceId);
    if (invoice) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Pagamento Confirmado',
        message: `Fatura de ${invoice.clientName} no valor de R$ ${invoice.totalAmount} foi quitada via PIX.`,
        link: '/financeiro',
        type: 'PAYMENT',
        isRead: false,
        createdAt: 'Agora mesmo',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    addToast({
      title: 'Pagamento Confirmado! 💸',
      description: 'Fatura atualizada para PAGO com sucesso.',
      type: 'success',
    });
  };

  const createInvoice = (invData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices((prev) => [newInv, ...prev]);
    addToast({
      title: 'Fatura Gerada',
      description: `Fatura de R$ ${newInv.totalAmount} emitida para ${newInv.clientName}.`,
      type: 'success',
    });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SystemStoreContext.Provider
      value={{
        clients,
        employees,
        campaigns,
        tasks,
        calendarEvents,
        serviceRequests,
        invoices,
        monthlyReports,
        notifications,
        unreadNotificationCount,
        toasts,
        addToast,
        removeToast,
        addClient,
        updateClient,
        deleteClient,
        addEmployee,
        updateEmployee,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        addTaskComment,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        addServiceRequest,
        approveServiceRequest,
        rejectServiceRequest,
        markInvoiceAsPaid,
        createInvoice,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        adminWhatsApp,
        updateAdminWhatsApp,
        pixKey,
        updatePixKey,
        pixBeneficiary,
        updatePixBeneficiary,
      }}
    >
      {children}
    </SystemStoreContext.Provider>
  );
}

export function useSystemStore() {
  const context = useContext(SystemStoreContext);
  if (!context) {
    throw new Error('useSystemStore must be used within a SystemStoreProvider');
  }
  return context;
}
