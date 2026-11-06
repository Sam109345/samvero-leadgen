import { EmailThread, EmailMessage, Lead, ChatAttachment, VoiceNoteData } from '@/types';

// In-memory thread storage for active session (zero mock data: initialized empty, populated by genuine outreach)
let inboxThreads: EmailThread[] = [];

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
      clientEmail: lead.contact.email || (lead.contact.phone ? `Phone: ${lead.contact.phone}` : 'Direct Outreach'),
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

  const realisticReplies: Array<{
    content: string;
    snippet: string;
    sentiment: 'positive' | 'booking' | 'pricing' | 'neutral';
    attachments?: ChatAttachment[];
    voiceNote?: VoiceNoteData;
  }> = [
    {
      content: `Hello!\n\nI reviewed the live website draft you sent over and I'm very impressed with the speed and layout. Can you send over a contract and pricing breakdown? We want to get started next week.\n\nBest,\n${thread.contactPerson}`,
      snippet: 'Very impressed with the website draft! Can you send pricing?',
      sentiment: 'positive',
    },
    {
      content: `Hello,\n\nThanks for following up. Are you available for a 15-minute consultation tomorrow afternoon?\n\nCheers,\n${thread.contactPerson}`,
      snippet: 'Available for a 15-minute consultation tomorrow?',
      sentiment: 'booking',
    },
    {
      content: `Hello,\n\nWe reviewed the proposal and prototype you shared. What are your rates and delivery timeline to finalize this?\n\nRegards,\n${thread.contactPerson}`,
      snippet: 'Loved the proposal & prototype! What are your rates?',
      sentiment: 'pricing',
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
    attachments: chosen.attachments,
    voiceNote: chosen.voiceNote,
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
 * Sends a reply back to the client
 */
export function sendReplyToClient(
  threadId: string, 
  replyContent: string,
  attachments?: ChatAttachment[],
  voiceNote?: VoiceNoteData
): { success: boolean; message?: EmailMessage } {
  const thread = inboxThreads.find((t) => t.id === threadId);
  if (!thread) return { success: false };

  const contentText = (replyContent || '').trim() 
    ? replyContent.trim() 
    : (voiceNote ? '🎙️ [Voice Message]' : (attachments && attachments.length > 0 ? `📎 [Attached ${attachments.length} file(s)]` : ''));

  const userReply: EmailMessage = {
    id: `msg-reply-${Date.now()}`,
    sender: 'user',
    senderName: 'Outreach Specialist',
    senderEmail: process.env.SMTP_FROM || 'outreach@samvero.com',
    subject: `Re: Digital Proposal Discussion - ${thread.businessName}`,
    content: contentText,
    timestamp: 'Just now',
    attachments: attachments && attachments.length > 0 ? attachments : undefined,
    voiceNote: voiceNote || undefined,
  };

  thread.messages.push(userReply);
  
  let snippet = `You: ${contentText}`;
  if (voiceNote) {
    snippet = 'You: 🎙️ Sent a voice message';
  } else if (attachments && attachments.length > 0) {
    snippet = `You: 📎 Sent ${attachments.length} attachment(s)`;
  }
  
  thread.lastMessageSnippet = snippet.substring(0, 75);
  thread.lastMessageAt = 'Just now';
  thread.status = 'awaiting_reply';
  thread.unread = false;

  return { success: true, message: userReply };
}

/**
 * Deletes or recalls a message from a thread ("Delete for everyone" or "Permanent delete")
 */
export function deleteMessageFromThread(
  threadId: string,
  messageId: string,
  mode: 'for_everyone' | 'permanent' = 'for_everyone'
): { success: boolean; thread?: EmailThread; message?: EmailMessage; error?: string } {
  const thread = inboxThreads.find((t) => t.id === threadId);
  if (!thread) return { success: false, error: 'Thread not found' };

  const msgIndex = thread.messages.findIndex((m) => m.id === messageId);
  if (msgIndex === -1) return { success: false, error: 'Message not found' };

  const targetMsg = thread.messages[msgIndex];

  if (mode === 'permanent') {
    thread.messages.splice(msgIndex, 1);
  } else {
    targetMsg.isDeletedForEveryone = true;
    targetMsg.deletedAt = 'Just now';
    targetMsg.deletedBy = targetMsg.sender === 'user' ? 'You' : targetMsg.senderName;
    targetMsg.content = '🚫 This message was deleted for everyone';
    targetMsg.attachments = undefined;
    targetMsg.voiceNote = undefined;
    targetMsg.previewUrl = undefined;
  }

  // Recalculate lastMessageSnippet
  if (thread.messages.length === 0) {
    thread.lastMessageSnippet = 'No messages in conversation';
    thread.lastMessageAt = 'Just now';
  } else {
    const lastMsg = thread.messages[thread.messages.length - 1];
    if (lastMsg.isDeletedForEveryone) {
      thread.lastMessageSnippet = '🚫 This message was deleted for everyone';
    } else if (lastMsg.voiceNote) {
      thread.lastMessageSnippet = lastMsg.sender === 'user' ? 'You: 🎙️ Sent a voice message' : '🎙️ Sent a voice message';
    } else if (lastMsg.attachments && lastMsg.attachments.length > 0) {
      thread.lastMessageSnippet = lastMsg.sender === 'user' ? `You: 📎 Sent ${lastMsg.attachments.length} attachment(s)` : `📎 Sent ${lastMsg.attachments.length} attachment(s)`;
    } else {
      const prefix = lastMsg.sender === 'user' ? 'You: ' : '';
      thread.lastMessageSnippet = `${prefix}${lastMsg.content || ''}`.substring(0, 75);
    }
    thread.lastMessageAt = lastMsg.timestamp || 'Just now';
  }

  return { success: true, thread, message: targetMsg };
}
