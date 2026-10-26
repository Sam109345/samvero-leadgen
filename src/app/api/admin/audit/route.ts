import { NextRequest, NextResponse } from 'next/server';
import { 
  getAuditSessions, 
  getStaffMembers, 
  getOutreachRecords, 
  terminateSession, 
  recordStaffOutreach,
  recordLoginSession
} from '@/lib/audit-store';
import { getLivePublicIp, resolveIpDetails } from '@/lib/geo-ip';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const role = request.cookies.get('samvero_portal_role')?.value || request.headers.get('x-portal-role');

    // Only Admin can access the complete Audit & Reach Center
    if (role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Restricted access: Super Admin privileges required to view Audit & Device Monitor.' 
        },
        { status: 403 }
      );
    }

    let sessions = getAuditSessions();

    // If no session exists yet, register the current live active admin terminal
    if (sessions.length === 0) {
      const cfIp = request.headers.get('cf-connecting-ip');
      const xForwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
      const xRealIp = request.headers.get('x-real-ip');
      const headerIp = cfIp || xForwardedFor || xRealIp;

      const liveIp = await getLivePublicIp(headerIp || undefined);
      const geo = await resolveIpDetails(liveIp);

      const userAgent = request.headers.get('user-agent') || '';
      const os = userAgent.includes('Windows') ? 'Windows 11 Pro 64-bit' : userAgent.includes('Macintosh') ? 'macOS' : 'Linux Workstation';
      const browser = userAgent.includes('Chrome') ? 'Google Chrome' : userAgent.includes('Safari') ? 'Safari' : 'Web Browser';

      recordLoginSession({
        role: 'admin',
        userName: 'Sameer (Executive Admin)',
        ipAddress: geo.ip,
        deviceName: `${os} (Executive Workstation)`,
        browser,
        os,
        location: `${geo.city}, ${geo.country}`,
        isp: geo.isp,
      });

      sessions = getAuditSessions();
    }

    const staff = getStaffMembers();
    const outreachRecords = getOutreachRecords();

    // Summary calculations from real live data
    const activeSessionsCount = sessions.filter((s) => s.status === 'active').length;
    const totalOutreachCount = outreachRecords.length;
    const totalDealsWon = staff.reduce((acc, curr) => acc + curr.dealsWonCount, 0);
    const totalCallsBooked = staff.reduce((acc, curr) => acc + curr.callsBookedCount, 0);

    return NextResponse.json({
      success: true,
      sessions,
      staff,
      outreachRecords,
      summary: {
        activeSessionsCount,
        totalSessionsCount: sessions.length,
        totalOutreachCount,
        totalDealsWon,
        totalCallsBooked,
        totalStaffMembers: staff.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch audit data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, outreachData } = body;

    const role = request.cookies.get('samvero_portal_role')?.value || request.headers.get('x-portal-role');

    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin privileges required.' },
        { status: 403 }
      );
    }

    if (action === 'terminate_session' && sessionId) {
      const success = terminateSession(sessionId);
      return NextResponse.json({
        success,
        message: success ? `Session ${sessionId} terminated successfully` : 'Session not found',
        sessions: getAuditSessions(),
      });
    }

    if (action === 'record_outreach' && outreachData) {
      const newRecord = recordStaffOutreach(outreachData);
      return NextResponse.json({
        success: true,
        record: newRecord,
        staff: getStaffMembers(),
        outreachRecords: getOutreachRecords(),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid audit action specified' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error executing audit action' },
      { status: 500 }
    );
  }
}
