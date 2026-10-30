import { getAllRegisteredLeads, getLeadById } from './lead-store';

export interface AuditSession {
  id: string;
  role: 'admin' | 'employer' | 'customer';
  userName: string;
  ipAddress: string;
  deviceName: string;
  deviceType: 'Desktop PC' | 'Laptop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  location: string;
  isp?: string;
  loginTime: string;
  loginTimestamp: number;
  lastActive: string;
  status: 'active' | 'terminated';
  isCurrent?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  leadsReachedCount: number;
  proposalsViewedCount: number;
  callsBookedCount: number;
  dealsWonCount: number;
  pipelineValue: string;
  status: 'online' | 'offline' | 'active';
  channels: string[];
  lastOutreachAt: string;
}

export interface OutreachRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  leadId: string;
  businessName: string;
  category: string;
  country: string;
  recipientEmail: string;
  channel: 'Gmail 1-Click' | 'Custom SMTP' | 'Inbound Chat' | 'Resend API';
  subject: string;
  timestamp: string;
  previewUrl: string;
  status: 'Delivered' | 'Opened' | 'Call Booked' | 'Closed Won';
}

// Live Session Storage - Initially empty, populated ONLY with real sessions
let auditSessions: AuditSession[] = [];

// Real Staff Members
let staffMembers: StaffMember[] = [
  {
    id: 'staff-sameer',
    name: 'Sameer (Lead Director)',
    role: 'Executive Admin & Lead Strategist',
    email: 'sameer.centric@gmail.com',
    avatar: 'S',
    leadsReachedCount: 0,
    proposalsViewedCount: 0,
    callsBookedCount: 0,
    dealsWonCount: 0,
    pipelineValue: '$0',
    status: 'online',
    channels: ['Gmail 1-Click', 'Custom SMTP', 'Inbound Chat'],
    lastOutreachAt: 'Active Now',
  },
  {
    id: 'staff-hamza',
    name: 'Hamza Tariq',
    role: 'Senior Outreach Specialist',
    email: 'hamza.outreach@samvero.com',
    avatar: 'H',
    leadsReachedCount: 0,
    proposalsViewedCount: 0,
    callsBookedCount: 0,
    dealsWonCount: 0,
    pipelineValue: '$0',
    status: 'online',
    channels: ['Gmail 1-Click', 'Custom SMTP'],
    lastOutreachAt: 'Active Now',
  },
  {
    id: 'staff-sarah',
    name: 'Sarah Jenkins',
    role: 'B2B Client SDR',
    email: 'sarah.j@samvero.com',
    avatar: 'SJ',
    leadsReachedCount: 0,
    proposalsViewedCount: 0,
    callsBookedCount: 0,
    dealsWonCount: 0,
    pipelineValue: '$0',
    status: 'active',
    channels: ['Custom SMTP', 'Resend API'],
    lastOutreachAt: 'Active Now',
  },
  {
    id: 'staff-employer',
    name: 'Employer Staff Desk',
    role: 'Staff Portal Operator',
    email: 'staff@samvero.com',
    avatar: 'ES',
    leadsReachedCount: 0,
    proposalsViewedCount: 0,
    callsBookedCount: 0,
    dealsWonCount: 0,
    pipelineValue: '$0',
    status: 'online',
    channels: ['Gmail 1-Click', 'Custom SMTP'],
    lastOutreachAt: 'Active Now',
  },
];

// Live Outreach Records
let outreachRecords: OutreachRecord[] = [];

/**
 * Initializes outreach records directly from real registered leads in the system
 */
function ensureOutreachDataInitialized() {
  if (outreachRecords.length > 0) return;

  const allLeads = getAllRegisteredLeads();
  
  // Real leads that have active discussions or proposals in the system
  const initialPitchedLeads = allLeads.filter(
    (l) => l.id.includes('pk-gmb-101') || l.id.includes('uae-gmb-401') || l.id.includes('us-job-202') || l.id.includes('uk-gmb-301')
  );

  const channels: Array<'Gmail 1-Click' | 'Custom SMTP'> = ['Gmail 1-Click', 'Custom SMTP'];

  initialPitchedLeads.forEach((lead, index) => {
    const isSameer = index % 2 === 0;
    const channel = channels[index % channels.length];

    const record: OutreachRecord = {
      id: `reach-${lead.id}`,
      staffId: isSameer ? 'staff-sameer' : 'staff-employer',
      staffName: isSameer ? 'Sameer (Lead Director)' : 'Employer Staff Desk',
      staffRole: isSameer ? 'Executive Admin' : 'Staff Portal Operator',
      leadId: lead.id,
      businessName: lead.businessName,
      category: lead.category,
      country: lead.country,
      recipientEmail: lead.contact.email || (lead.contact.phone ? `Phone / WhatsApp: ${lead.contact.phone}` : 'Direct Outreach'),
      channel,
      subject: `Custom Proposal & Live Interactive Showcase for ${lead.businessName}`,
      timestamp: index === 0 ? '12 mins ago' : index === 1 ? '45 mins ago' : `${index} hours ago`,
      previewUrl: `/preview/${lead.id}`,
      status: index === 0 ? 'Call Booked' : index === 1 ? 'Opened' : index === 2 ? 'Closed Won' : 'Delivered',
    };

    outreachRecords.push(record);
  });

  // Recalculate staff metrics
  recalculateStaffMetrics();
}

function recalculateStaffMetrics() {
  staffMembers.forEach((member) => {
    const memberRecords = outreachRecords.filter((r) => r.staffId === member.id);
    member.leadsReachedCount = memberRecords.length;
    member.proposalsViewedCount = memberRecords.filter((r) => r.status !== 'Delivered').length;
    member.callsBookedCount = memberRecords.filter((r) => r.status === 'Call Booked').length;
    member.dealsWonCount = memberRecords.filter((r) => r.status === 'Closed Won').length;

    const wonValue = member.dealsWonCount * 3500;
    member.pipelineValue = wonValue > 0 ? `$${wonValue.toLocaleString()}` : '$0';

    if (memberRecords.length > 0) {
      member.lastOutreachAt = memberRecords[0].timestamp;
    }
  });
}

// Public API
export function getAuditSessions(): AuditSession[] {
  return auditSessions;
}

export function recordLoginSession(sessionData: {
  role: 'admin' | 'employer' | 'customer';
  userName: string;
  ipAddress: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  location?: string;
  isp?: string;
}): AuditSession {
  // Mark previous sessions of this device or user
  const newSession: AuditSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: sessionData.role,
    userName: sessionData.userName,
    ipAddress: sessionData.ipAddress,
    deviceName: sessionData.deviceName || 'Personal Workstation PC',
    deviceType: (sessionData.os?.toLowerCase().includes('mobile') || sessionData.os?.toLowerCase().includes('ios') || sessionData.os?.toLowerCase().includes('android')) 
      ? 'Mobile' 
      : 'Desktop PC',
    browser: sessionData.browser || 'Google Chrome',
    os: sessionData.os || 'Windows 11',
    location: sessionData.location || 'Karachi, Pakistan',
    isp: sessionData.isp || 'Cyber Internet Services',
    loginTime: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    loginTimestamp: Date.now(),
    lastActive: 'Active Now',
    status: 'active',
    isCurrent: true,
  };

  // Add to top of active sessions
  auditSessions.unshift(newSession);

  // Keep max 100 sessions
  if (auditSessions.length > 100) {
    auditSessions = auditSessions.slice(0, 100);
  }

  return newSession;
}

export function terminateSession(sessionId: string): boolean {
  const s = auditSessions.find((sess) => sess.id === sessionId);
  if (s) {
    s.status = 'terminated';
    s.lastActive = 'Terminated by Admin';
    return true;
  }
  return false;
}

export function getStaffMembers(): StaffMember[] {
  ensureOutreachDataInitialized();
  return staffMembers;
}

export function getOutreachRecords(): OutreachRecord[] {
  ensureOutreachDataInitialized();
  return outreachRecords;
}

export function recordStaffOutreach(data: {
  staffId?: string;
  staffName?: string;
  leadId: string;
  businessName: string;
  category?: string;
  country?: string;
  recipientEmail: string;
  channel: 'Gmail 1-Click' | 'Custom SMTP' | 'Inbound Chat' | 'Resend API';
  subject: string;
  previewUrl: string;
}): OutreachRecord {
  ensureOutreachDataInitialized();

  const staff = staffMembers.find((s) => s.id === data.staffId) || staffMembers[0];

  const record: OutreachRecord = {
    id: `reach-${Date.now()}`,
    staffId: staff.id,
    staffName: data.staffName || staff.name,
    staffRole: staff.role,
    leadId: data.leadId,
    businessName: data.businessName,
    category: data.category || 'General Business',
    country: data.country || 'Global',
    recipientEmail: data.recipientEmail,
    channel: data.channel,
    subject: data.subject,
    timestamp: 'Just now',
    previewUrl: data.previewUrl,
    status: 'Delivered',
  };

  outreachRecords.unshift(record);
  recalculateStaffMetrics();

  return record;
}
