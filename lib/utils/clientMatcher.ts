import { Client, Task, UserProfile } from '../types';

export function isTaskForClient(task: Task, client?: Client, user?: UserProfile | null): boolean {
  if (!client && !user) return false;
  const clientId = client?.id || user?.clientId;
  const clientName = (client?.name || user?.fullName || '').toLowerCase().trim();
  const companyName = (client?.companyName || '').toLowerCase().trim();
  const clientEmail = (client?.email || user?.email || '').toLowerCase().trim();

  // 1. Direct ID matches
  if (task.clientId && clientId && task.clientId === clientId) return true;
  if (user?.clientId && task.clientId === user.clientId) return true;
  if (client?.id && task.clientId === client.id) return true;

  // 2. Procampo special match (handles UUID vs 'cli-procampo')
  if (
    (task.clientId === 'cli-procampo' || (task.clientName && task.clientName.toLowerCase().includes('procampo'))) &&
    (clientEmail.includes('procampo') || clientName.includes('procampo') || companyName.includes('procampo') || (clientId && clientId.includes('procampo')))
  ) {
    return true;
  }

  // 3. Name or company matching
  if (task.clientName) {
    const tName = task.clientName.toLowerCase().trim();
    if (clientName && (tName === clientName || tName.includes(clientName) || clientName.includes(tName))) return true;
    if (companyName && (tName === companyName || tName.includes(companyName) || companyName.includes(tName))) return true;
  }

  return false;
}
