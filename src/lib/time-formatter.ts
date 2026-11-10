/**
 * time-formatter.ts
 * Bulletproof relative time calculation for leads across the platform.
 * Formats timestamps into natural human expressions: "Just now", "2 mins ago", "14 mins ago", "2 hrs ago", etc.
 */

import { Lead } from '@/types';

/**
 * Parses timestamp from various lead formats and calculates exact relative time ago.
 * Handles numerical ms/seconds, ISO strings, and pre-formatted shorthand strings.
 */
export function formatLeadTimeAgo(target: Partial<Lead> | number | string | undefined | null): string {
  if (target === undefined || target === null) return 'Just now';

  let timestampMs: number | undefined;

  // Case 1: Pure numerical timestamp
  if (typeof target === 'number') {
    if (target <= 0) return 'Just now';
    timestampMs = target < 1e11 ? target * 1000 : target;
  }
  // Case 2: String value
  else if (typeof target === 'string') {
    const trimmed = target.trim();
    if (!trimmed || trimmed.toLowerCase() === 'just now') return 'Just now';

    // Check if it's already a shorthand string like "21m ago", "5m ago", "12s ago", "2h ago", "1d ago"
    const shortMatch = trimmed.match(/^(\d+)\s*([smhd]|mins?|secs?|hours?|hrs?|days?)(?:\s*ago)?$/i);
    if (shortMatch) {
      const val = parseInt(shortMatch[1], 10);
      const unit = shortMatch[2].toLowerCase();
      if (unit.startsWith('s')) {
        return val <= 5 ? 'Just now' : `${val} secs ago`;
      }
      if (unit.startsWith('m')) {
        return val === 1 ? '1 min ago' : `${val} mins ago`;
      }
      if (unit.startsWith('h')) {
        return val === 1 ? '1 hr ago' : `${val} hrs ago`;
      }
      if (unit.startsWith('d')) {
        return val === 1 ? '1 day ago' : `${val} days ago`;
      }
    }

    // Try parsing as ISO / Date string
    const parsed = new Date(trimmed).getTime();
    if (!isNaN(parsed) && parsed > 0) {
      timestampMs = parsed;
    } else {
      // Non-parseable text (e.g. "Active Local Entity" or custom status)
      return trimmed;
    }
  }
  // Case 3: Lead object
  else {
    const lead = target as Partial<Lead>;
    if (typeof lead.incomingAt === 'number' && lead.incomingAt > 0) {
      timestampMs = lead.incomingAt < 1e11 ? lead.incomingAt * 1000 : lead.incomingAt;
    } else if (lead.postedAt) {
      return formatLeadTimeAgo(lead.postedAt);
    } else if (lead.timeAgo) {
      return formatLeadTimeAgo(lead.timeAgo);
    } else {
      return 'Just now';
    }
  }

  // Calculate elapsed time from timestampMs to now
  if (timestampMs) {
    const now = Date.now();
    const diffMs = Math.max(0, now - timestampMs);
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 45) {
      return 'Just now';
    }
    if (diffSec < 90) {
      return '1 min ago';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} mins ago`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      return diffHour === 1 ? '1 hr ago' : `${diffHour} hrs ago`;
    }
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    }
    const diffMonth = Math.floor(diffDay / 30);
    return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
  }

  return 'Just now';
}

/**
 * Helper to determine if a lead arrived within the last 15 minutes (for "NEW" badge)
 */
export function isLeadBrandNew(target: Partial<Lead> | number | string | undefined | null): boolean {
  if (!target) return false;
  if (typeof target === 'object' && target !== null) {
    const lead = target as Partial<Lead>;
    if (typeof lead.incomingAt === 'number' && lead.incomingAt > 0) {
      const ms = lead.incomingAt < 1e11 ? lead.incomingAt * 1000 : lead.incomingAt;
      return Date.now() - ms < 15 * 60 * 1000;
    }
    const str = `${lead.timeAgo || ''} ${lead.postedAt || ''}`.toLowerCase();
    if (str.includes('just now') || str.includes('sec') || str.match(/\b([1-9]|1[0-5])\s*m/)) {
      return true;
    }
  } else if (typeof target === 'number') {
    const ms = target < 1e11 ? target * 1000 : target;
    return Date.now() - ms < 15 * 60 * 1000;
  } else if (typeof target === 'string') {
    const str = target.toLowerCase();
    return str.includes('just now') || str.includes('sec') || Boolean(str.match(/\b([1-9]|1[0-5])\s*m/));
  }
  return false;
}
