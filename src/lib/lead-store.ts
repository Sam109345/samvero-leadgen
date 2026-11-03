import { Lead } from '@/types';
import { INITIAL_LEADS } from './mock-data';
import { loadAllStoredLeads } from './leads-persistent-store';
import { 
  getLeadAssignedUser, 
  canUserAccessLead, 
  initializeDefaultAssignments, 
  getPortalUserById 
} from './user-store';

// Global in-memory registry of all leads (mock + streaming + user-created)
const leadsRegistry = new Map<string, Lead>();

// Initialize with verified dataset
INITIAL_LEADS.forEach((lead) => {
  leadsRegistry.set(lead.id.toLowerCase(), lead);
});

// Seed balanced initial assignments among staff members
initializeDefaultAssignments(INITIAL_LEADS);

export function registerLead(lead: Lead): void {
  if (lead && lead.id) {
    leadsRegistry.set(lead.id.toLowerCase(), lead);
  }
}

export function getLeadById(id: string): Lead | undefined {
  if (!id) return undefined;
  const key = id.toLowerCase();
  let lead = leadsRegistry.get(key);

  if (!lead) {
    const stored = loadAllStoredLeads();
    lead = stored.find((l) => l.id?.toLowerCase() === key);
    if (lead) {
      leadsRegistry.set(key, lead);
    }
  }

  if (!lead) return undefined;

  const assignedUser = getLeadAssignedUser(lead.id);
  return {
    ...lead,
    assignedToUserId: assignedUser?.id,
    assignedToUserName: assignedUser?.name,
  };
}

export function getAllRegisteredLeads(): Lead[] {
  try {
    const stored = loadAllStoredLeads();
    for (const l of stored) {
      if (l && l.id && !leadsRegistry.has(l.id.toLowerCase())) {
        leadsRegistry.set(l.id.toLowerCase(), l);
      }
    }
  } catch {}

  return Array.from(leadsRegistry.values()).map((lead) => {
    const assignedUser = getLeadAssignedUser(lead.id);
    return {
      ...lead,
      assignedToUserId: assignedUser?.id,
      assignedToUserName: assignedUser?.name,
    };
  });
}

/**
 * Returns leads filtered strictly for a specific user.
 * - If userId belongs to Super Admin or a Global User: returns ALL registered leads!
 * - If userId belongs to a normal staff user: returns ONLY leads assigned to that user.
 *   Zero duplication between staff members!
 */
export function getLeadsForUser(userId?: string): Lead[] {
  const allLeads = getAllRegisteredLeads();
  if (!userId) return allLeads;

  const user = getPortalUserById(userId);
  if (!user || user.isGlobalUser || user.role === 'admin' || user.role === 'global_user') {
    return allLeads;
  }

  // Filter strictly for this staff user
  return allLeads.filter((l) => canUserAccessLead(userId, l.id));
}
