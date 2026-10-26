export interface AuditSession {
  id: string;
  role: 'admin' | 'employer';
  userName: string;
  ipAddress: string;
  deviceName: string;
  deviceType: 'Desktop PC' | 'Laptop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  location: string;
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

// In-Memory Storage for Active and Historical Sessions
let auditSessions: AuditSession[] = [
  {
    id: 'sess-adm-01',
    role: 'admin',
    userName: 'Sameer (Executive Admin)',
    ipAddress: '182.185.142.92',
    deviceName: 'Sameer-Workstation (Win32)',
    deviceType: 'Desktop PC',
    browser: 'Chrome 129.0 (Windows)',
    os: 'Windows 11 Pro 64-bit',
    location: 'Lahore, Pakistan',
    loginTime: 'Oct 26, 2026, 02:40 PM',
    loginTimestamp: Date.now() - 1000 * 60 * 25,
    lastActive: 'Active Now',
    status: 'active',
  },
  {
    id: 'sess-emp-02',
    role: 'employer',
    userName: 'Hamza Tariq (Outreach Desk)',
    ipAddress: '110.39.24.118',
    deviceName: 'Hamza-ThinkPad-T14',
    deviceType: 'Laptop',
    browser: 'Chrome 128.0 (Windows)',
    os: 'Windows 10 Enterprise',
    location: 'Karachi, Pakistan',
    loginTime: 'Oct 26, 2026, 11:15 AM',
    loginTimestamp: Date.now() - 1000 * 60 * 220,
    lastActive: '14 mins ago',
    status: 'active',
  },
  {
    id: 'sess-emp-03',
    role: 'employer',
    userName: 'Sarah Jenkins (US Sales Desk)',
    ipAddress: '72.229.28.185',
    deviceName: 'Sarah-MacBookPro-M3',
    deviceType: 'Laptop',
    browser: 'Safari 17.5 (macOS)',
    os: 'macOS Sonoma 14.5',
    location: 'New York, United States',
    loginTime: 'Oct 25, 2026, 08:30 PM',
    loginTimestamp: Date.now() - 1000 * 60 * 1100,
    lastActive: 'Yesterday',
    status: 'terminated',
  },
  {
    id: 'sess-adm-04',
    role: 'admin',
    userName: 'Sameer (Executive Admin)',
    ipAddress: '194.135.34.12',
    deviceName: 'Sameer-iPhone15Pro',
    deviceType: 'Mobile',
    browser: 'Mobile Safari 17.4',
    os: 'iOS 17.4',
    location: 'Dubai, UAE',
    loginTime: 'Oct 24, 2026, 04:12 PM',
    loginTimestamp: Date.now() - 1000 * 60 * 2800,
    lastActive: '2 days ago',
    status: 'terminated',
  },
];

// Staff Members List with Performance Metrics
let staffMembers: StaffMember[] = [
  {
    id: 'staff-sameer',
    name: 'Sameer (Lead Director)',
    role: 'Executive Admin & Lead Strategist',
    email: 'sameer.centric@gmail.com',
    avatar: 'S',
    leadsReachedCount: 38,
    proposalsViewedCount: 31,
    callsBookedCount: 12,
    dealsWonCount: 7,
    pipelineValue: '$24,500',
    status: 'online',
    channels: ['Gmail 1-Click', 'Custom SMTP', 'Inbound Voice Memos'],
    lastOutreachAt: '8 mins ago',
  },
  {
    id: 'staff-hamza',
    name: 'Hamza Tariq',
    role: 'Senior Outreach Specialist (Middle East & PK)',
    email: 'hamza.outreach@samvero.com',
    avatar: 'H',
    leadsReachedCount: 26,
    proposalsViewedCount: 19,
    callsBookedCount: 8,
    dealsWonCount: 4,
    pipelineValue: '$14,200',
    status: 'online',
    channels: ['Gmail 1-Click', 'Custom SMTP'],
    lastOutreachAt: '25 mins ago',
  },
  {
    id: 'staff-sarah',
    name: 'Sarah Jenkins',
    role: 'B2B Client SDR (US & UK Tech)',
    email: 'sarah.j@samvero.com',
    avatar: 'SJ',
    leadsReachedCount: 19,
    proposalsViewedCount: 14,
    callsBookedCount: 5,
    dealsWonCount: 3,
    pipelineValue: '$9,800',
    status: 'active',
    channels: ['Custom SMTP', 'Resend API'],
    lastOutreachAt: '2 hours ago',
  },
  {
    id: 'staff-ali',
    name: 'Ali Raza',
    role: 'Creative Design & Branding Associate',
    email: 'ali.raza@samvero.com',
    avatar: 'A',
    leadsReachedCount: 15,
    proposalsViewedCount: 11,
    callsBookedCount: 4,
    dealsWonCount: 2,
    pipelineValue: '$5,500',
    status: 'offline',
    channels: ['Gmail 1-Click', 'Inbound Chat'],
    lastOutreachAt: 'Yesterday',
  },
  {
    id: 'staff-employer',
    name: 'Employer Staff Desk',
    role: 'Staff Portal Operator',
    email: 'staff@samvero.com',
    avatar: 'ES',
    leadsReachedCount: 11,
    proposalsViewedCount: 7,
    callsBookedCount: 2,
    dealsWonCount: 1,
    pipelineValue: '$3,200',
    status: 'online',
    channels: ['Gmail 1-Click', 'Custom SMTP'],
    lastOutreachAt: '1 hour ago',
  },
];

// Chronological Outreach Records ("Kis bandy ne kitni leads ko reach kiya hai")
let outreachRecords: OutreachRecord[] = [
  {
    id: 'reach-101',
    staffId: 'staff-sameer',
    staffName: 'Sameer (Lead Director)',
    staffRole: 'Executive Admin',
    leadId: 'pk-gmb-101',
    businessName: 'Dr. Zeeshan Aesthetics & Dental Care',
    category: 'Healthcare & Aesthetics',
    country: 'Pakistan',
    recipientEmail: 'dr.zeeshan.clinic.lhr@gmail.com',
    channel: 'Gmail 1-Click',
    subject: 'Custom Digital Proposal & Patient Portal for Dr. Zeeshan Aesthetics',
    timestamp: '12 mins ago',
    previewUrl: '/preview/pk-gmb-101',
    status: 'Call Booked',
  },
  {
    id: 'reach-102',
    staffId: 'staff-sameer',
    staffName: 'Sameer (Lead Director)',
    staffRole: 'Executive Admin',
    leadId: 'uae-gmb-401',
    businessName: 'Dr. Noor Aesthetics & Laser Institute',
    category: 'Healthcare & Aesthetics',
    country: 'UAE',
    recipientEmail: 'info@drnooraesthetics.ae',
    channel: 'Gmail 1-Click',
    subject: 'Bespoke Patient Acquisition Portal & 14-Screen Native App for Jumeirah Clinic',
    timestamp: '45 mins ago',
    previewUrl: '/preview/uae-gmb-401',
    status: 'Opened',
  },
  {
    id: 'reach-103',
    staffId: 'staff-hamza',
    staffName: 'Hamza Tariq',
    staffRole: 'Senior Outreach Specialist',
    leadId: 'uae-gmb-402',
    businessName: 'Corniche Horizon Architects & Interiors',
    category: 'Architecture & Design',
    country: 'UAE',
    recipientEmail: 'projects@cornichehorizon.ae',
    channel: 'Custom SMTP',
    subject: 'High-Converting Luxury Architectural Showcase for Corniche Horizon',
    timestamp: '1 hour ago',
    previewUrl: '/preview/uae-gmb-402',
    status: 'Delivered',
  },
  {
    id: 'reach-104',
    staffId: 'staff-sarah',
    staffName: 'Sarah Jenkins',
    staffRole: 'B2B Client SDR',
    leadId: 'us-job-202',
    businessName: 'CognitiveScale Dynamics Inc.',
    category: 'Web Development & SaaS',
    country: 'US',
    recipientEmail: 'talent@cognitivescaledynamics.io',
    channel: 'Custom SMTP',
    subject: 'Next.js 14 + Tailwind Redesign for CognitiveScale Dynamics',
    timestamp: '2 hours ago',
    previewUrl: '/preview/us-job-202',
    status: 'Closed Won',
  },
  {
    id: 'reach-105',
    staffId: 'staff-sameer',
    staffName: 'Sameer (Lead Director)',
    staffRole: 'Executive Admin',
    leadId: 'uk-gmb-301',
    businessName: 'Kensington Aesthetic Medicine',
    category: 'Healthcare & Aesthetics',
    country: 'UK',
    recipientEmail: 'consultations@kensingtonaesthetic.co.uk',
    channel: 'Gmail 1-Click',
    subject: 'Harley Street Digital Storefront & Booking Infrastructure',
    timestamp: '3 hours ago',
    previewUrl: '/preview/uk-gmb-301',
    status: 'Call Booked',
  },
  {
    id: 'reach-106',
    staffId: 'staff-ali',
    staffName: 'Ali Raza',
    staffRole: 'Creative Design Associate',
    leadId: 'uae-gmb-403',
    businessName: 'Al-Misk Al-Malaki Perfumery House',
    category: 'Luxury Retail & E-Commerce',
    country: 'UAE',
    recipientEmail: 'concierge@almiskalmalaki.ae',
    channel: 'Gmail 1-Click',
    subject: 'Luxury E-Commerce Flagship Store & 6 Vector Brand Concepts',
    timestamp: '4 hours ago',
    previewUrl: '/preview/uae-gmb-403',
    status: 'Delivered',
  },
  {
    id: 'reach-107',
    staffId: 'staff-employer',
    staffName: 'Employer Staff Desk',
    staffRole: 'Staff Portal Operator',
    leadId: 'pk-gmb-102',
    businessName: 'Al-Buraq Legal Associates',
    category: 'Legal & Professional Services',
    country: 'Pakistan',
    recipientEmail: 'contact@alburaqlegal.pk',
    channel: 'Custom SMTP',
    subject: 'Bespoke Law Practice Showcase & Corporate Case Intake Portal',
    timestamp: '5 hours ago',
    previewUrl: '/preview/pk-gmb-102',
    status: 'Opened',
  },
];

// Helper Functions
export function getAuditSessions(): AuditSession[] {
  return auditSessions;
}

export function recordLoginSession(sessionData: {
  role: 'admin' | 'employer';
  userName: string;
  ipAddress: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  location?: string;
}): AuditSession {
  const newSession: AuditSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: sessionData.role,
    userName: sessionData.userName,
    ipAddress: sessionData.ipAddress || '127.0.0.1',
    deviceName: sessionData.deviceName || 'Personal Workstation PC',
    deviceType: (sessionData.os?.toLowerCase().includes('mobile') || sessionData.os?.toLowerCase().includes('ios') || sessionData.os?.toLowerCase().includes('android')) 
      ? 'Mobile' 
      : 'Desktop PC',
    browser: sessionData.browser || 'Web Browser',
    os: sessionData.os || 'Windows 11',
    location: sessionData.location || 'Local Network',
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

  // Prepend to list
  auditSessions.unshift(newSession);

  // Keep list tidy (max 100 sessions)
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
  return staffMembers;
}

export function getOutreachRecords(): OutreachRecord[] {
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
  const staff = staffMembers.find((s) => s.id === data.staffId) || staffMembers[0]; // fallback to Sameer

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

  // Increment staff member stats
  staff.leadsReachedCount += 1;
  staff.lastOutreachAt = 'Just now';

  outreachRecords.unshift(record);
  return record;
}
