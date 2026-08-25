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
} from './mappers';
import { Client, Employee, Task, ServiceRequest } from '@/lib/types';
import { mockClients, mockEmployees, mockTasks, mockServiceRequests } from '@/lib/data/mockData';

export async function fetchInitialDataFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // 1. Fetch Clients
    const { data: dbClients, error: clientsError } = await supabase.from('clients').select('*');
    let loadedClients: Client[] = [];

    if (!clientsError && dbClients && dbClients.length > 0) {
      loadedClients = dbClients.map(mapDbToClient);
    } else if (dbClients && dbClients.length === 0) {
      // Auto seed initial clients to Supabase
      console.log('Seeding initial clients to Supabase...');
      for (const client of mockClients) {
        const payload = mapClientToDb(client);
        await supabase.from('clients').insert([payload]);
      }
      const { data: seeded } = await supabase.from('clients').select('*');
      if (seeded) loadedClients = seeded.map(mapDbToClient);
    }

    // 2. Fetch Employees
    const { data: dbEmployees } = await supabase.from('employees').select('*');
    let loadedEmployees: Employee[] = [];
    if (dbEmployees && dbEmployees.length > 0) {
      loadedEmployees = dbEmployees.map(mapDbToEmployee);
    }

    // 3. Fetch Tasks
    const { data: dbTasks } = await supabase.from('tasks').select('*');
    let loadedTasks: Task[] = [];
    if (dbTasks && dbTasks.length > 0) {
      loadedTasks = dbTasks.map((t) => {
        const matchingClient = loadedClients.find((c) => c.id === t.client_id);
        const matchingEmp = loadedEmployees.find((e) => e.id === t.assignee_id);
        return mapDbToTask(t, matchingClient?.name, matchingEmp?.name);
      });
    }

    // 4. Fetch Service Requests
    const { data: dbRequests } = await supabase.from('service_requests').select('*');
    let loadedRequests: ServiceRequest[] = [];
    if (dbRequests && dbRequests.length > 0) {
      loadedRequests = dbRequests.map((r) => {
        const matchingClient = loadedClients.find((c) => c.id === r.client_id);
        return mapDbToRequest(r, matchingClient?.name);
      });
    }

    return {
      clients: loadedClients.length > 0 ? loadedClients : null,
      employees: loadedEmployees.length > 0 ? loadedEmployees : null,
      tasks: loadedTasks.length > 0 ? loadedTasks : null,
      serviceRequests: loadedRequests.length > 0 ? loadedRequests : null,
    };
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return null;
  }
}

export async function syncClientToSupabase(client: Client) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapClientToDb(client);
    // Check if client exists by email or id
    const { data: existing } = await supabase.from('clients').select('id').eq('email', client.email).single();
    if (existing) {
      await supabase.from('clients').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('clients').insert([payload]);
    }
  } catch (err) {
    console.warn('Supabase sync error (client):', err);
  }
}

export async function deleteClientFromSupabase(clientId: string, email?: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    if (clientId.length > 20) {
      await supabase.from('clients').delete().eq('id', clientId);
    } else if (email) {
      await supabase.from('clients').delete().eq('email', email);
    }
  } catch (err) {
    console.warn('Supabase delete error (client):', err);
  }
}

export async function syncTaskToSupabase(task: Task) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapTaskToDb(task);
    if (task.id.length > 20) {
      await supabase.from('tasks').upsert([payload]);
    } else {
      await supabase.from('tasks').insert([payload]);
    }
  } catch (err) {
    console.warn('Supabase sync error (task):', err);
  }
}

export async function syncRequestToSupabase(req: ServiceRequest) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload = mapRequestToDb(req);
    await supabase.from('service_requests').insert([payload]);
  } catch (err) {
    console.warn('Supabase sync error (service_request):', err);
  }
}
