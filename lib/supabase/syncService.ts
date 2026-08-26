import { supabase, isSupabaseConfigured } from './client';
import {
  mapDbToClient,
  mapClientToDb,
  mapDbToEmployee,
  mapEmployeeToDb,
  mapDbToTask,
  mapTaskToDb,
  mapDbToRequest,
  mapRequestToDb,
  mapDbToCampaign,
  mapCampaignToDb,
  mapDbToCalendarEvent,
  mapCalendarEventToDb,
  mapDbToInvoice,
  mapInvoiceToDb,
} from './mappers';
import {
  Client,
  Employee,
  Task,
  ServiceRequest,
  Campaign,
  CalendarEvent,
  Invoice,
} from '@/lib/types';
import {
  mockClients,
  mockEmployees,
  mockTasks,
  mockServiceRequests,
  mockCampaigns,
  mockCalendarEvents,
  mockInvoices,
} from '@/lib/data/mockData';

function isUuid(val?: string): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

// ============================================================
// FETCH ALL INITIAL DATA
// ============================================================
export async function fetchInitialDataFromSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      clients: mockClients,
      employees: mockEmployees,
      campaigns: mockCampaigns,
      tasks: mockTasks,
      serviceRequests: mockServiceRequests,
      calendarEvents: mockCalendarEvents,
      invoices: mockInvoices,
    };
  }

  try {
    // 1. Clients
    const { data: dbClients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedClients: Client[] = [];
    if (!clientsError && dbClients && dbClients.length > 0) {
      loadedClients = dbClients.map(mapDbToClient);
    }
    // Merge with mockClients to ensure demo data is preserved
    const mergedClients = [...loadedClients];
    for (const mClient of mockClients) {
      if (!mergedClients.some((c) => c.id === mClient.id || c.email.toLowerCase() === mClient.email.toLowerCase())) {
        mergedClients.push(mClient);
      }
    }

    // 2. Employees
    const { data: dbEmployees } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedEmployees: Employee[] = [];
    if (dbEmployees && dbEmployees.length > 0) {
      loadedEmployees = dbEmployees.map(mapDbToEmployee);
    }
    const mergedEmployees = [...loadedEmployees];
    for (const mEmp of mockEmployees) {
      if (!mergedEmployees.some((e) => e.id === mEmp.id || e.email.toLowerCase() === mEmp.email.toLowerCase())) {
        mergedEmployees.push(mEmp);
      }
    }

    // 3. Campaigns
    const { data: dbCampaigns } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedCampaigns: Campaign[] = [];
    if (dbCampaigns && dbCampaigns.length > 0) {
      loadedCampaigns = dbCampaigns.map((c) => mapDbToCampaign(c, mergedClients));
    }
    const mergedCampaigns = [...loadedCampaigns];
    for (const mCamp of mockCampaigns) {
      if (!mergedCampaigns.some((c) => c.id === mCamp.id || c.name.toLowerCase() === mCamp.name.toLowerCase())) {
        mergedCampaigns.push(mCamp);
      }
    }

    // 4. Tasks
    const { data: dbTasks } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedTasks: Task[] = [];
    if (dbTasks && dbTasks.length > 0) {
      loadedTasks = dbTasks.map((t) => {
        const client = mergedClients.find((c) => c.id === t.client_id || (t.client_id && c.id.includes(t.client_id)));
        const emp = mergedEmployees.find((e) => e.id === t.assignee_id);
        return mapDbToTask(t, client?.name, emp?.name);
      });
    }
    // Merge with mockTasks so all videos and review tasks are always available
    const mergedTasks = [...loadedTasks];
    for (const mTask of mockTasks) {
      if (!mergedTasks.some((t) => t.id === mTask.id || (t.title.toLowerCase() === mTask.title.toLowerCase() && t.clientId === mTask.clientId))) {
        mergedTasks.push(mTask);
      }
    }

    // 5. Service Requests
    const { data: dbRequests } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedRequests: ServiceRequest[] = [];
    if (dbRequests && dbRequests.length > 0) {
      loadedRequests = dbRequests.map((r) => {
        const client = mergedClients.find((c) => c.id === r.client_id);
        return mapDbToRequest(r, client?.name);
      });
    }
    const mergedRequests = [...loadedRequests];
    for (const mReq of mockServiceRequests) {
      if (!mergedRequests.some((r) => r.id === mReq.id)) {
        mergedRequests.push(mReq);
      }
    }

    // 6. Calendar Events
    const { data: dbEvents } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true });

    let loadedEvents: CalendarEvent[] = [];
    if (dbEvents && dbEvents.length > 0) {
      loadedEvents = dbEvents.map((e) => mapDbToCalendarEvent(e, mergedClients));
    }
    const mergedEvents = [...loadedEvents];
    for (const mEvt of mockCalendarEvents) {
      if (!mergedEvents.some((e) => e.id === mEvt.id)) {
        mergedEvents.push(mEvt);
      }
    }

    // 7. Invoices
    const { data: dbInvoices } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedInvoices: Invoice[] = [];
    if (dbInvoices && dbInvoices.length > 0) {
      loadedInvoices = dbInvoices.map((i) => mapDbToInvoice(i, mergedClients));
    }
    const mergedInvoices = [...loadedInvoices];
    for (const mInv of mockInvoices) {
      if (!mergedInvoices.some((i) => i.id === mInv.id)) {
        mergedInvoices.push(mInv);
      }
    }

    return {
      clients: mergedClients,
      employees: mergedEmployees,
      campaigns: mergedCampaigns,
      tasks: mergedTasks,
      serviceRequests: mergedRequests,
      calendarEvents: mergedEvents,
      invoices: mergedInvoices,
    };
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return {
      clients: mockClients,
      employees: mockEmployees,
      campaigns: mockCampaigns,
      tasks: mockTasks,
      serviceRequests: mockServiceRequests,
      calendarEvents: mockCalendarEvents,
      invoices: mockInvoices,
    };
  }
}

// ============================================================
// CLIENT SYNC
// ============================================================
export async function syncClientToSupabase(client: Client) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapClientToDb(client);
    const { data: existing } = await supabase.from('clients').select('id').eq('email', client.email).maybeSingle();
    if (existing) {
      await supabase.from('clients').update(payload).eq('id', existing.id);
    } else {
      const insertPayload = isUuid(client.id) ? { ...payload, id: client.id } : payload;
      await supabase.from('clients').insert([insertPayload]);
    }
  } catch (err) {
    console.warn('Supabase sync error (client):', err);
  }
}

export async function deleteClientFromSupabase(clientId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    if (isUuid(clientId)) {
      await supabase.from('clients').delete().eq('id', clientId);
    }
  } catch (err) {
    console.warn('Supabase delete error (client):', err);
  }
}

// ============================================================
// EMPLOYEE SYNC
// ============================================================
export async function syncEmployeeToSupabase(emp: Employee) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapEmployeeToDb(emp);
    const { data: existing } = await supabase.from('employees').select('id').eq('email', emp.email).maybeSingle();
    if (existing) {
      await supabase.from('employees').update(payload).eq('id', existing.id);
    } else {
      const insertPayload = isUuid(emp.id) ? { ...payload, id: emp.id } : payload;
      await supabase.from('employees').insert([insertPayload]);
    }
  } catch (err) {
    console.warn('Supabase sync error (employee):', err);
  }
}

// ============================================================
// TASK SYNC
// ============================================================
export async function syncTaskToSupabase(task: Task) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapTaskToDb(task);

    // If client_id is not a UUID, try to resolve it from Supabase clients table
    if (payload.client_id && !isUuid(payload.client_id)) {
      const { data: matchingClient } = await supabase
        .from('clients')
        .select('id')
        .or(`email.ilike.%procampo%,name.ilike.%procampo%`)
        .maybeSingle();
      if (matchingClient?.id) {
        payload.client_id = matchingClient.id;
      }
    }

    if (isUuid(task.id)) {
      const { data: existing } = await supabase.from('tasks').select('id').eq('id', task.id).maybeSingle();
      if (existing) {
        await supabase.from('tasks').update(payload).eq('id', task.id);
      } else {
        await supabase.from('tasks').insert([{ ...payload, id: task.id }]);
      }
    } else {
      // If task has valid UUID client_id, insert it
      if (isUuid(payload.client_id)) {
        await supabase.from('tasks').insert([payload]);
      }
    }
  } catch (err) {
    console.warn('Supabase sync error (task):', err);
  }
}

export async function deleteTaskFromSupabase(taskId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    if (isUuid(taskId)) {
      await supabase.from('tasks').delete().eq('id', taskId);
    }
  } catch (err) {
    console.warn('Supabase delete error (task):', err);
  }
}

// ============================================================
// CAMPAIGN SYNC
// ============================================================
export async function syncCampaignToSupabase(camp: Campaign) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapCampaignToDb(camp);
    if (isUuid(camp.id)) {
      const { data: existing } = await supabase.from('campaigns').select('id').eq('id', camp.id).maybeSingle();
      if (existing) {
        await supabase.from('campaigns').update(payload).eq('id', camp.id);
      } else {
        await supabase.from('campaigns').insert([{ ...payload, id: camp.id }]);
      }
    }
  } catch (err) {
    console.warn('Supabase sync error (campaign):', err);
  }
}

export async function deleteCampaignFromSupabase(campId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    if (isUuid(campId)) {
      await supabase.from('campaigns').delete().eq('id', campId);
    }
  } catch (err) {
    console.warn('Supabase delete error (campaign):', err);
  }
}

// ============================================================
// CALENDAR EVENT SYNC
// ============================================================
export async function syncCalendarEventToSupabase(event: CalendarEvent) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapCalendarEventToDb(event);
    if (isUuid(event.id)) {
      const { data: existing } = await supabase.from('calendar_events').select('id').eq('id', event.id).maybeSingle();
      if (existing) {
        await supabase.from('calendar_events').update(payload).eq('id', event.id);
      } else {
        await supabase.from('calendar_events').insert([{ ...payload, id: event.id }]);
      }
    }
  } catch (err) {
    console.warn('Supabase sync error (calendar_event):', err);
  }
}

export async function deleteCalendarEventFromSupabase(eventId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    if (isUuid(eventId)) {
      await supabase.from('calendar_events').delete().eq('id', eventId);
    }
  } catch (err) {
    console.warn('Supabase delete error (calendar_event):', err);
  }
}

// ============================================================
// SERVICE REQUEST SYNC
// ============================================================
export async function syncRequestToSupabase(req: ServiceRequest) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapRequestToDb(req);
    if (isUuid(req.id)) {
      const { data: existing } = await supabase.from('service_requests').select('id').eq('id', req.id).maybeSingle();
      if (existing) {
        await supabase.from('service_requests').update(payload).eq('id', req.id);
      } else {
        await supabase.from('service_requests').insert([{ ...payload, id: req.id }]);
      }
    }
  } catch (err) {
    console.warn('Supabase sync error (service_request):', err);
  }
}

// ============================================================
// INVOICE SYNC
// ============================================================
export async function syncInvoiceToSupabase(inv: Invoice) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapInvoiceToDb(inv);
    if (isUuid(inv.id)) {
      const { data: existing } = await supabase.from('invoices').select('id').eq('id', inv.id).maybeSingle();
      if (existing) {
        await supabase.from('invoices').update(payload).eq('id', inv.id);
      } else {
        await supabase.from('invoices').insert([{ ...payload, id: inv.id }]);
      }
    }
  } catch (err) {
    console.warn('Supabase sync error (invoice):', err);
  }
}

// ============================================================
// PROFILE SYNC (for login persistence across devices)
// ============================================================
export async function syncProfileToSupabase(profile: {
  id: string;
  email: string;
  username: string;
  password: string;
  fullName: string;
  role: string;
  clientId?: string;
  employeeId?: string;
  avatarUrl?: string;
}) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = {
      email: profile.email,
      username: profile.username,
      initial_password: profile.password,
      full_name: profile.fullName,
      role: profile.role,
      client_id: isUuid(profile.clientId) ? profile.clientId : null,
      employee_id: isUuid(profile.employeeId) ? profile.employeeId : null,
      avatar_url: profile.avatarUrl || null,
    };
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', profile.email).maybeSingle();
    if (existing) {
      await supabase.from('profiles').update(payload).eq('id', existing.id);
    } else {
      const insertPayload = isUuid(profile.id) ? { ...payload, id: profile.id } : payload;
      await supabase.from('profiles').insert([insertPayload]);
    }
  } catch (err) {
    console.warn('Supabase sync error (profile):', err);
  }
}

export async function fetchProfilesFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data } = await supabase.from('profiles').select('*');
    return data || [];
  } catch {
    return null;
  }
}
