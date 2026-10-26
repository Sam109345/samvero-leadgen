import { Lead } from '@/types';
import { INITIAL_LEADS } from './mock-data';

// Global in-memory registry of all leads (mock + streaming + user-created)
const leadsRegistry = new Map<string, Lead>();

// Initialize with verified dataset
INITIAL_LEADS.forEach((lead) => {
  leadsRegistry.set(lead.id.toLowerCase(), lead);
});

export function registerLead(lead: Lead): void {
  leadsRegistry.set(lead.id.toLowerCase(), lead);
}

export function getLeadById(id: string): Lead | undefined {
  if (!id) return undefined;
  return leadsRegistry.get(id.toLowerCase());
}

export function getAllRegisteredLeads(): Lead[] {
  return Array.from(leadsRegistry.values());
}
