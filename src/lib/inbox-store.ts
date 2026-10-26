import { EmailThread, EmailMessage, Lead } from '@/types';

// In-memory thread storage for active session
let inboxThreads: EmailThread[] = [
  {
    id: 'thread-pk-101',
    leadId: 'pk-gmb-101',
    businessName: 'Dr. Zeeshan Aesthetics & Dental Care',
    clientEmail: 'dr.zeeshan.clinic.lhr@gmail.com',
    contactPerson: 'Dr. Zeeshan Ali (Founder)',
    city: 'Lahore',
    country: 'Pakistan',
    lastMessageSnippet: 'Loved the mobile preview! Can we do a quick Zoom call on Friday?',
    lastMessageAt: '12 mins ago',
    unread: true,
    status: 'hot_reply',
    sentiment: 'booking',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'SAMVERO Acquisition Team',
        senderEmail: 'outreach@samvero.com',
        subject: 'Custom Digital Proposal & Website Showcase for Dr. Zeeshan Aesthetics',
        content: `Hi Dr. Zeeshan,\n\nWe noticed your premier clinic in DHA Phase 3 Lahore and noticed you rely largely on walk-in patients and Instagram DMs.\n\nOur team has pre-configured a bespoke, mobile-optimized patient booking portal tailored exclusively for your treatments.\n\nYou can explore your live interactive preview here: /preview/pk-gmb-101\n\nLet us know if you'd like to activate this on your custom domain!`,
        timestamp: '1 hour ago',
        previewUrl: '/preview/pk-gmb-101',
      },
      {
        id: 'msg-2',
        sender: 'client',
        senderName: 'Dr. Zeeshan Ali',
        senderEmail: 'dr.zeeshan.clinic.lhr@gmail.com',
        subject: 'Re: Custom Digital Proposal & Website Showcase for Dr. Zeeshan Aesthetics',
        content: `Hello SAMVERO team,\n\nThank you for putting this together! I just checked the live preview on my iPhone and it looks remarkably clean—especially the WhatsApp consultation button and services grid.\n\nWe definitely need an official web presence to streamline patient bookings. Are you available for a brief Zoom or WhatsApp call this Friday at 4:30 PM PKT to discuss your setup cost and timeline?\n\nRegards,\nDr. Zeeshan Ali\nCosmetic Dentist & Founder`,
        timestamp: '12 mins ago',
        sentiment: 'booking',
      },
    ],
  },
  {
    id: 'thread-us-202',
    leadId: 'us-job-202',
    businessName: 'CognitiveScale Dynamics Inc.',
    clientEmail: 'talent@cognitivescaledynamics.io',
    contactPerson: 'Elena Rostova (Head of Growth)',
    city: 'San Francisco',
    country: 'US',
    lastMessageSnippet: 'The sample UI looks sharp. What is your turnaround time for Next.js revamp?',
    lastMessageAt: '45 mins ago',
    unread: true,
    status: 'hot_reply',
    sentiment: 'pricing',
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        senderName: 'SAMVERO Technical Solutions',
        senderEmail: 'outreach@samvero.com',
        subject: 'Next.js 14 + Tailwind Redesign for CognitiveScale Dynamics',
        content: `Hi Elena,\n\nI reviewed your Upwork listing for the B2B SaaS corporate redesign. We specialize in glassmorphic Next.js + Tailwind architectures.\n\nWe synthesized a preliminary visual component mockup here: /preview/us-job-202\n\nHappy to walk through our technical roadmap whenever convenient.`,
        timestamp: '3 hours ago',
        previewUrl: '/preview/us-job-202',
      },
      {
        id: 'msg-4',
        sender: 'client',
        senderName: 'Elena Rostova',
        senderEmail: 'talent@cognitivescaledynamics.io',
        subject: 'Re: Next.js 14 + Tailwind Redesign for CognitiveScale Dynamics',
        content: `Hi Sameer,\n\nThanks for reaching out with a working prototype so quickly! The glassmorphism card styling is right in line with what our design director is looking for.\n\nCould you give me an estimate on turnaround time for an 8-10 page migration, and are you able to sign a standard mutual NDA before we share the Figma design system?\n\nBest,\nElena Rostova\nHead of Growth, CognitiveScale`,
        timestamp: '45 mins ago',
        sentiment: 'pricing',
      },
    ],
  },
  {
    id: 'thread-uk-301',
    leadId: 'uk-gmb-301',
    businessName: 'Kensington Aesthetic Medicine',
    clientEmail: 'consultations@kensingtonaesthetic.co.uk',
    contactPerson: 'Dr. Charlotte Bell (Medical Director)',
    city: 'London',
    country: 'UK',
    lastMessageSnippet: 'Very interested in the luxury aesthetic. Can you share case studies?',
    lastMessageAt: '2 hours ago',
    unread: false,
    status: 'hot_reply',
    sentiment: 'positive',
    messages: [
      {
        id: 'msg-5',
        sender: 'user',
        senderName: 'SAMVERO UK Partner Desk',
        senderEmail: 'outreach@samvero.com',
        subject: 'Exclusive Harley Street Digital Storefront for Kensington Aesthetic Medicine',
        content: `Dear Dr. Bell,\n\nCongratulations on the launch of your Harley Street clinic! We noticed you currently do not have a live bespoke website.\n\nWe put together a luxury digital showcase: /preview/uk-gmb-301\n\nWould you be open to reviewing this with your clinic management?`,
        timestamp: '5 hours ago',
        previewUrl: '/preview/uk-gmb-301',
      },
      {
        id: 'msg-6',
        sender: 'client',
        senderName: 'Dr. Charlotte Bell',
        senderEmail: 'consultations@kensingtonaesthetic.co.uk',
        subject: 'Re: Exclusive Harley Street Digital Storefront for Kensington Aesthetic Medicine',
        content: `Dear SAMVERO Team,\n\nThank you for your thoughtful email. The preview website reflects the luxury, discreet aesthetic we maintain on Harley Street.\n\nI am presenting our digital roadmap to our partners tomorrow morning. Could you email over a PDF overview of your pricing packages and any references from other UK clinics?\n\nWarm regards,\nDr. Charlotte Bell\nMedical Director`,
        timestamp: '2 hours ago',
        sentiment: 'positive',
      },
    ],
  },
];

export function getInboxThreads(): EmailThread[] {
  return inboxThreads;
}

export function getThreadById(id: string): EmailThread | undefined {
  return inboxThreads.find((t) => t.id === id);
}

export function getThreadByLeadId(leadId: string): EmailThread | undefined {
  return inboxThreads.find((t) => t.leadId === leadId);
}

export function markThreadAsRead(threadId: string) {
  const t = inboxThreads.find((item) => item.id === threadId);
  if (t) {
    t.unread = false;
  }
}

/**
 * Called when a user sends a pitch from the app
 */
export function recordSentPitch(
  lead: Lead,
  subject: string,
  content: string,
  previewUrl?: string
): EmailThread {
  let thread = inboxThreads.find((t) => t.leadId === lead.id);

  const newMsg: EmailMessage = {
    id: `msg-${Date.now()}`,
    sender: 'user',
    senderName: 'SAMVERO Outreach Team',
    senderEmail: process.env.SMTP_FROM || 'outreach@samvero.com',
    subject,
    content,
    timestamp: 'Just now',
    previewUrl,
  };

  if (!thread) {
    thread = {
      id: `thread-${lead.id}`,
      leadId: lead.id,
      businessName: lead.businessName,
      clientEmail: lead.contact.email || 'client@business.com',
      contactPerson: lead.contact.contactPerson || 'Business Owner',
      city: lead.city,
      country: lead.country,
      lastMessageSnippet: `Sent: ${subject}`,
      lastMessageAt: 'Just now',
      unread: false,
      status: 'awaiting_reply',
      messages: [newMsg],
    };
    inboxThreads.unshift(thread);
  } else {
    thread.messages.push(newMsg);
    thread.lastMessageSnippet = `Sent: ${subject}`;
    thread.lastMessageAt = 'Just now';
    thread.status = 'awaiting_reply';
  }

  return thread;
}

/**
 * Simulates a realistic incoming client reply for a thread
 */
export function simulateClientReply(threadId: string): { success: boolean; thread?: EmailThread; message?: EmailMessage } {
  const thread = inboxThreads.find((t) => t.id === threadId);
  if (!thread) return { success: false };

  const realisticReplies = [
    {
      content: `Hi Sameer!\n\nI reviewed the live website draft you sent over and I'm very impressed with the speed and layout. Can you send over a contract and pricing breakdown? We want to get started next week.\n\nBest,\n${thread.contactPerson}`,
      snippet: 'Very impressed with the website draft! Can you send pricing?',
      sentiment: 'positive' as const,
    },
    {
      content: `Hello,\n\nThanks for following up. Are you available for a 15-minute phone or WhatsApp consultation tomorrow afternoon? We have a couple of questions about CRM integration.\n\nCheers,\n${thread.contactPerson}`,
      snippet: 'Available for a 15-minute consultation tomorrow?',
      sentiment: 'booking' as const,
    },
    {
      content: `Hey Sameer,\n\nWe reviewed the 6 vector logo concepts and the 14-screen mobile app interactive prototype you synthesized for us. Absolutely stellar work! What are your rates and delivery timeline to finalize this?\n\nRegards,\n${thread.contactPerson}`,
      snippet: 'Loved the 6 logo concepts & 14-screen app prototype! What are your rates?',
      sentiment: 'pricing' as const,
    },
  ];

  const chosen = realisticReplies[Math.floor(Math.random() * realisticReplies.length)];

  const incomingMsg: EmailMessage = {
    id: `msg-client-${Date.now()}`,
    sender: 'client',
    senderName: thread.contactPerson,
    senderEmail: thread.clientEmail,
    subject: `Re: Regarding your digital proposal for ${thread.businessName}`,
    content: chosen.content,
    timestamp: 'Just now',
    sentiment: chosen.sentiment,
  };

  thread.messages.push(incomingMsg);
  thread.lastMessageSnippet = chosen.snippet;
  thread.lastMessageAt = 'Just now';
  thread.unread = true;
  thread.status = 'hot_reply';
  thread.sentiment = chosen.sentiment;

  // Move thread to top
  inboxThreads = [thread, ...inboxThreads.filter((t) => t.id !== threadId)];

  return { success: true, thread, message: incomingMsg };
}

/**
 * Sends a reply back to the client from Sameerly
 */
export function sendReplyToClient(threadId: string, replyContent: string): { success: boolean; message?: EmailMessage } {
  const thread = inboxThreads.find((t) => t.id === threadId);
  if (!thread) return { success: false };

  const userReply: EmailMessage = {
    id: `msg-reply-${Date.now()}`,
    sender: 'user',
    senderName: 'SAMVERO Partner Director',
    senderEmail: 'outreach@samvero.com',
    subject: `Re: Digital Proposal Discussion - ${thread.businessName}`,
    content: replyContent,
    timestamp: 'Just now',
  };

  thread.messages.push(userReply);
  thread.lastMessageSnippet = `You: ${replyContent.substring(0, 60)}...`;
  thread.lastMessageAt = 'Just now';
  thread.status = 'awaiting_reply';
  thread.unread = false;

  return { success: true, message: userReply };
}
