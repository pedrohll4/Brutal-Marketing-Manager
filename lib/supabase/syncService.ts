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

// ============================================================
// FETCH ALL INITIAL DATA
// ============================================================
export async function fetchInitialDataFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // 1. Clients
    const { data: dbClients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedClients: Client[] = [];
    if (!clientsError && dbClients) {
      if (dbClients.length === 0) {
        // Seed demo clients only once
        for (const client of mockClients) {
          await supabase.from('clients').insert([mapClientToDb(client)]);
        }
        const { data: seeded } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
        if (seeded) loadedClients = seeded.map(mapDbToClient);
      } else {
        loadedClients = dbClients.map(mapDbToClient);
      }
    }

    // 2. Employees
    const { data: dbEmployees } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedEmployees: Employee[] = [];
    if (dbEmployees) {
      if (dbEmployees.length === 0) {
        for (const emp of mockEmployees) {
          await supabase.from('employees').insert([mapEmployeeToDb(emp)]);
        }
        const { data: seeded } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
        if (seeded) loadedEmployees = seeded.map(mapDbToEmployee);
      } else {
        loadedEmployees = dbEmployees.map(mapDbToEmployee);
      }
    }

    // 3. Campaigns
    const { data: dbCampaigns } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedCampaigns: Campaign[] = [];
    if (dbCampaigns) {
      if (dbCampaigns.length === 0) {
        for (const camp of mockCampaigns) {
          await supabase.from('campaigns').insert([mapCampaignToDb(camp)]);
        }
        const { data: seeded } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
        if (seeded) loadedCampaigns = seeded.map((c) => mapDbToCampaign(c, loadedClients));
      } else {
        loadedCampaigns = dbCampaigns.map((c) => mapDbToCampaign(c, loadedClients));
      }
    }

    // 4. Tasks
    const { data: dbTasks } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedTasks: Task[] = [];
    if (dbTasks) {
      if (dbTasks.length === 0) {
        for (const task of mockTasks) {
          await supabase.from('tasks').insert([mapTaskToDb(task)]);
        }
        const { data: seeded } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        if (seeded)
          loadedTasks = seeded.map((t) => {
            const client = loadedClients.find((c) => c.id === t.client_id);
            const emp = loadedEmployees.find((e) => e.id === t.assignee_id);
            return mapDbToTask(t, client?.name, emp?.name);
          });
      } else {
        loadedTasks = dbTasks.map((t) => {
          const client = loadedClients.find((c) => c.id === t.client_id);
          const emp = loadedEmployees.find((e) => e.id === t.assignee_id);
          return mapDbToTask(t, client?.name, emp?.name);
        });
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
        const client = loadedClients.find((c) => c.id === r.client_id);
        return mapDbToRequest(r, client?.name);
      });
    }

    // 6. Calendar Events
    const { data: dbEvents } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true });

    let loadedEvents: CalendarEvent[] = [];
    if (dbEvents) {
      if (dbEvents.length === 0) {
        for (const evt of mockCalendarEvents) {
          await supabase.from('calendar_events').insert([mapCalendarEventToDb(evt)]);
        }
        const { data: seeded } = await supabase.from('calendar_events').select('*').order('event_date', { ascending: true });
        if (seeded) loadedEvents = seeded.map((e) => mapDbToCalendarEvent(e, loadedClients));
      } else {
        loadedEvents = dbEvents.map((e) => mapDbToCalendarEvent(e, loadedClients));
      }
    }

    // 7. Invoices
    const { data: dbInvoices } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    let loadedInvoices: Invoice[] = [];
    if (dbInvoices) {
      if (dbInvoices.length === 0) {
        for (const inv of mockInvoices) {
          await supabase.from('invoices').insert([mapInvoiceToDb(inv)]);
        }
        const { data: seeded } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
        if (seeded) loadedInvoices = seeded.map((i) => mapDbToInvoice(i, loadedClients));
      } else {
        loadedInvoices = dbInvoices.map((i) => mapDbToInvoice(i, loadedClients));
      }
    }

    return {
      clients: loadedClients,
      employees: loadedEmployees,
      campaigns: loadedCampaigns,
      tasks: loadedTasks,
      serviceRequests: loadedRequests,
      calendarEvents: loadedEvents,
      invoices: loadedInvoices,
    };
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return null;
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
      await supabase.from('clients').insert([{ ...payload, id: client.id }]);
    }
  } catch (err) {
    console.warn('Supabase sync error (client):', err);
  }
}

export async function deleteClientFromSupabase(clientId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('clients').delete().eq('id', clientId);
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
      await supabase.from('employees').insert([{ ...payload, id: emp.id }]);
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
    const { data: existing } = await supabase.from('tasks').select('id').eq('id', task.id).maybeSingle();
    if (existing) {
      await supabase.from('tasks').update(payload).eq('id', task.id);
    } else {
      await supabase.from('tasks').insert([{ ...payload, id: task.id }]);
    }
  } catch (err) {
    console.warn('Supabase sync error (task):', err);
  }
}

export async function deleteTaskFromSupabase(taskId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('tasks').delete().eq('id', taskId);
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
    const { data: existing } = await supabase.from('campaigns').select('id').eq('id', camp.id).maybeSingle();
    if (existing) {
      await supabase.from('campaigns').update(payload).eq('id', camp.id);
    } else {
      await supabase.from('campaigns').insert([{ ...payload, id: camp.id }]);
    }
  } catch (err) {
    console.warn('Supabase sync error (campaign):', err);
  }
}

export async function deleteCampaignFromSupabase(campId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('campaigns').delete().eq('id', campId);
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
    const { data: existing } = await supabase.from('calendar_events').select('id').eq('id', event.id).maybeSingle();
    if (existing) {
      await supabase.from('calendar_events').update(payload).eq('id', event.id);
    } else {
      await supabase.from('calendar_events').insert([{ ...payload, id: event.id }]);
    }
  } catch (err) {
    console.warn('Supabase sync error (calendar_event):', err);
  }
}

export async function deleteCalendarEventFromSupabase(eventId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('calendar_events').delete().eq('id', eventId);
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
    const { data: existing } = await supabase.from('service_requests').select('id').eq('id', req.id).maybeSingle();
    if (existing) {
      await supabase.from('service_requests').update(payload).eq('id', req.id);
    } else {
      await supabase.from('service_requests').insert([{ ...payload, id: req.id }]);
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
    const { data: existing } = await supabase.from('invoices').select('id').eq('id', inv.id).maybeSingle();
    if (existing) {
      await supabase.from('invoices').update(payload).eq('id', inv.id);
    } else {
      await supabase.from('invoices').insert([{ ...payload, id: inv.id }]);
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
      client_id: profile.clientId || null,
      employee_id: profile.employeeId || null,
      avatar_url: profile.avatarUrl || null,
    };
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', profile.email).maybeSingle();
    if (existing) {
      await supabase.from('profiles').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('profiles').insert([{ ...payload, id: profile.id }]);
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
