'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIntegrationsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#060a14] flex items-center justify-center text-slate-400 font-mono text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
        <span>Redirecting to Admin Console...</span>
      </div>
    </div>
  );
}
