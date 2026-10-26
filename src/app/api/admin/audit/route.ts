import { NextRequest, NextResponse } from 'next/server';
import { 
  getAuditSessions, 
  getStaffMembers, 
  getOutreachRecords, 
  terminateSession, 
  recordStaffOutreach 
} from '@/lib/audit-store';

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

    const sessions = getAuditSessions();
    const staff = getStaffMembers();
    const outreachRecords = getOutreachRecords();

    // Summary calculations
    const activeSessionsCount = sessions.filter((s) => s.status === 'active').length;
    const totalOutreachCount = staff.reduce((acc, curr) => acc + curr.leadsReachedCount, 0);
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
