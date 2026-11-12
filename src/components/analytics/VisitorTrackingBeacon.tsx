'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTrackingBeacon() {
  const pathname = usePathname();
  const visitorIdRef = useRef<string>('');
  const sessionStartRef = useRef<number>(Date.now());
  const clickThrottleRef = useRef<number>(0);

  useEffect(() => {
    // Generate or fetch persistent visitor ID
    try {
      let vid = localStorage.getItem('samvero_vid');
      if (!vid) {
        vid = 'vid-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
        localStorage.setItem('samvero_vid', vid);
      }
      visitorIdRef.current = vid;
    } catch {
      visitorIdRef.current = 'vid-' + Math.random().toString(36).substring(2, 10);
    }

    // Track initial page view
    const sendPageView = () => {
      try {
        const payload = JSON.stringify({
          visitorId: visitorIdRef.current,
          page: pathname || '/',
          referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
        } else {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // quiet fallback
      }
    };

    sendPageView();
  }, [pathname]);

  // Click tracker for interactive elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      if (now - clickThrottleRef.current < 500) return; // 500ms debounce
      clickThrottleRef.current = now;

      try {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Find nearest interactive element (button, anchor, or role="button")
        const interactive = target.closest('button, a, [role="button"], input[type="submit"]') as HTMLElement | null;
        if (!interactive) return;

        const rawLabel =
          interactive.getAttribute('aria-label') ||
          interactive.innerText?.replace(/\s+/g, ' ')?.trim()?.slice(0, 50) ||
          interactive.getAttribute('title') ||
          interactive.tagName.toLowerCase();

        const label = (rawLabel || '').replace(/\s+/g, ' ').trim();

        if (!label) return;

        const duration = Math.round((Date.now() - sessionStartRef.current) / 1000);

        const payload = JSON.stringify({
          visitorId: visitorIdRef.current,
          page: pathname || '/',
          clickEvent: {
            target: label,
            x: Math.round(e.clientX),
            y: Math.round(e.clientY),
          },
          duration,
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
        } else {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
