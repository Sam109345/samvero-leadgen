import { PortalUser, Lead } from '@/types';

// In-Memory Portal Users Store
let portalUsers: PortalUser[] = [
  {
    id: 'user-sameer',
    username: 'Sameer',
    name: 'Sameer (Executive Admin)',
    email: 'sameer.centric@gmail.com',
    role: 'admin',
    isGlobalUser: true, // Super Admin sees ALL leads
    status: 'active',
    createdAt: '2026-10-01T08:00:00Z',
    assignedLeadIds: [],
    avatar: 'S',
    department: 'Executive Leadership',
    leadsReachedCount: 18,
    notes: 'Super Admin with global master access to all leads across all channels.',
  },
  {
    id: 'user-global',
    username: 'GlobalSupervisor',
    name: 'Global Director (All Leads Access)',
    email: 'global.desk@samvero.com',
    role: 'global_user',
    isGlobalUser: true, // Special Global User sees ALL leads
    status: 'active',
    createdAt: '2026-10-15T09:30:00Z',
    assignedLeadIds: [],
    avatar: 'GD',
    department: 'Global Operations Desk',
    leadsReachedCount: 24,
    notes: 'Global Lead Manager - Unrestricted visibility into all leads without platform boundaries.',
  },
  {
    id: 'user-hamza',
    username: 'hamza_tariq',
    name: 'Hamza Tariq',
    email: 'hamza.outreach@samvero.com',
    password: 'HamzaPass9821!',
    role: 'staff',
    isGlobalUser: false,
    status: 'active',
    createdAt: '2026-10-18T10:00:00Z',
    assignedLeadIds: [],
    avatar: 'H',
    department: 'SaaS & Web Acquisition',
    leadsReachedCount: 12,
    notes: 'Specializes in Upwork, Contra, and Freelancer.com Next.js projects.',
  },
  {
    id: 'user-sarah',
    username: 'sarah_jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.j@samvero.com',
    password: 'SarahPass4412!',
    role: 'staff',
    isGlobalUser: false,
    status: 'active',
    createdAt: '2026-10-20T11:15:00Z',
    assignedLeadIds: [],
    avatar: 'SJ',
    department: 'High-Ticket US & UK Outbound',
    leadsReachedCount: 9,
    notes: 'Specializes in US Telehealth, UK Harley Street Clinics, and Bark leads.',
  },
  {
    id: 'user-ali',
    username: 'ali_raza',
    name: 'Ali Raza',
    email: 'ali.enterprise@samvero.com',
    password: 'AliPass7731!',
    role: 'staff',
    isGlobalUser: false,
    status: 'active',
    createdAt: '2026-10-22T14:00:00Z',
    assignedLeadIds: [],
    avatar: 'AR',
    department: 'GCC & Dubai Enterprise Desk',
    leadsReachedCount: 15,
    notes: 'Focuses on UAE, DIFC FinTech, and Dubai Marina luxury leads.',
  },
  {
    id: 'user-employer',
    username: 'staff_operator',
    name: 'Employer Staff Desk',
    email: 'staff@samvero.com',
    password: 'Samvero#Secure9842',
    role: 'staff',
    isGlobalUser: false,
    status: 'active',
    createdAt: '2026-10-24T12:00:00Z',
    assignedLeadIds: [],
    avatar: 'ES',
    department: 'General Staff Desk',
    leadsReachedCount: 6,
    notes: 'Default employer terminal operator.',
  },
];

// Lead-to-User Assignment Index (leadId -> userId)
// Strict rule: A lead can only be assigned to ONE staff user.
const leadAssignmentIndex = new Map<string, string>();

export function getPortalUsers(): PortalUser[] {
  // Sync assignedLeadIds arrays with leadAssignmentIndex
  portalUsers.forEach((user) => {
    user.assignedLeadIds = [];
  });

  leadAssignmentIndex.forEach((userId, leadId) => {
    const user = portalUsers.find((u) => u.id === userId);
    if (user) {
      if (!user.assignedLeadIds.includes(leadId)) {
        user.assignedLeadIds.push(leadId);
      }
    }
  });

  return portalUsers;
}

export function getPortalUserById(id: string): PortalUser | undefined {
  return getPortalUsers().find((u) => u.id === id);
}

export function getPortalUserByUsername(username: string): PortalUser | undefined {
  return getPortalUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function createPortalUser(userData: {
  username: string;
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'staff' | 'global_user';
  isGlobalUser?: boolean;
  department?: string;
  notes?: string;
}): PortalUser {
  const newUser: PortalUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    username: userData.username.trim(),
    name: userData.name.trim(),
    email: userData.email.trim(),
    password: userData.password || 'Samvero2026!',
    role: userData.role || (userData.isGlobalUser ? 'global_user' : 'staff'),
    isGlobalUser: Boolean(userData.isGlobalUser || userData.role === 'global_user' || userData.role === 'admin'),
    status: 'active',
    createdAt: new Date().toISOString(),
    assignedLeadIds: [],
    avatar: userData.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'U',
    department: userData.department || 'Outreach Specialist',
    leadsReachedCount: 0,
    notes: userData.notes || 'Created via Admin Portal Management Desk',
  };

  portalUsers.push(newUser);
  return newUser;
}

export function updatePortalUser(id: string, updates: Partial<PortalUser>): PortalUser | undefined {
  const user = portalUsers.find((u) => u.id === id);
  if (!user) return undefined;

  Object.assign(user, updates);
  if (updates.role === 'admin' || updates.role === 'global_user') {
    user.isGlobalUser = true;
  }
  return user;
}

export function deletePortalUser(id: string): boolean {
  const index = portalUsers.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // Unassign all leads belonging to this user
  const leadsToUnassign: string[] = [];
  leadAssignmentIndex.forEach((assignedUserId, leadId) => {
    if (assignedUserId === id) {
      leadsToUnassign.push(leadId);
    }
  });
  leadsToUnassign.forEach((leadId) => leadAssignmentIndex.delete(leadId));

  portalUsers.splice(index, 1);
  return true;
}

export function toggleGlobalUser(id: string, isGlobal: boolean): PortalUser | undefined {
  const user = portalUsers.find((u) => u.id === id);
  if (!user) return undefined;

  user.isGlobalUser = isGlobal;
  if (isGlobal && user.role === 'staff') {
    user.role = 'global_user';
  } else if (!isGlobal && user.role === 'global_user') {
    user.role = 'staff';
  }
  return user;
}

/**
 * Assigns a lead exclusively to a specific user.
 * Overwrites any previous user assignment so no two staff members have the same lead!
 */
export function assignLeadToUser(leadId: string, userId: string): { success: boolean; leadId: string; userId: string; userName: string } {
  const targetUser = portalUsers.find((u) => u.id === userId);
  if (!targetUser) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Remove previous assignment from index
  leadAssignmentIndex.set(leadId, userId);

  return {
    success: true,
    leadId,
    userId,
    userName: targetUser.name,
  };
}

/**
 * Automatically & randomly distributes all unassigned leads among active staff users.
 * STRICT INVARIANT: Same lead will NEVER be assigned to multiple users!
 */
export function distributeRandomLeads(allLeads: Lead[]): {
  success: boolean;
  distributedCount: number;
  userAssignments: Record<string, number>;
  totalLeads: number;
} {
  // Only distribute among normal staff users (not admin/global)
  const staffRecipients = portalUsers.filter((u) => u.status === 'active' && !u.isGlobalUser && u.role !== 'admin');
  if (staffRecipients.length === 0) {
    return {
      success: false,
      distributedCount: 0,
      userAssignments: {},
      totalLeads: allLeads.length,
    };
  }

  // Find unassigned leads
  const unassignedLeads = allLeads.filter((l) => !leadAssignmentIndex.has(l.id));

  // Fisher-Yates Shuffle for true randomness
  const shuffled = [...unassignedLeads];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const userAssignments: Record<string, number> = {};
  staffRecipients.forEach((u) => (userAssignments[u.id] = 0));

  shuffled.forEach((lead, index) => {
    const assignedUser = staffRecipients[index % staffRecipients.length];
    leadAssignmentIndex.set(lead.id, assignedUser.id);
    userAssignments[assignedUser.id] = (userAssignments[assignedUser.id] || 0) + 1;
  });

  return {
    success: true,
    distributedCount: shuffled.length,
    userAssignments,
    totalLeads: allLeads.length,
  };
}

/**
 * Checks which user a lead belongs to
 */
export function getLeadAssignedUser(leadId: string): PortalUser | undefined {
  const userId = leadAssignmentIndex.get(leadId);
  if (!userId) return undefined;
  return portalUsers.find((u) => u.id === userId);
}

/**
 * Determines whether a user has permission to see a given lead.
 * Admin and Global User see ALL leads.
 * Staff users see ONLY their assigned leads.
 */
export function canUserAccessLead(userId: string, leadId: string): boolean {
  const user = getPortalUserById(userId);
  if (!user) return false;

  // Global user / Admin has unrestricted access to everything
  if (user.isGlobalUser || user.role === 'admin' || user.role === 'global_user') {
    return true;
  }

  // Regular staff: only if explicitly assigned
  return leadAssignmentIndex.get(leadId) === userId;
}

/**
 * Get assigned lead IDs for a user
 */
export function getUserAssignedLeadIds(userId: string): string[] {
  const user = getPortalUserById(userId);
  if (!user) return [];

  // Return all leads if global
  if (user.isGlobalUser || user.role === 'admin') {
    return []; // Empty indicates "all allowed"
  }

  const assigned: string[] = [];
  leadAssignmentIndex.forEach((uId, leadId) => {
    if (uId === userId) assigned.push(leadId);
  });
  return assigned;
}

/**
 * Pre-assigns initial balanced distribution so each staff user starts with exclusive leads
 */
export function initializeDefaultAssignments(allLeads: Lead[]): void {
  if (leadAssignmentIndex.size > 0) return;

  const staff = portalUsers.filter((u) => !u.isGlobalUser && u.role === 'staff');
  if (staff.length === 0) return;

  allLeads.forEach((lead, idx) => {
    const targetUser = staff[idx % staff.length];
    leadAssignmentIndex.set(lead.id, targetUser.id);
  });
}
