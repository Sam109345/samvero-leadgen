import { NextRequest, NextResponse } from 'next/server';
import { 
  getPortalUsers, 
  createPortalUser, 
  updatePortalUser, 
  deletePortalUser, 
  toggleGlobalUser, 
  assignLeadToUser, 
  distributeRandomLeads 
} from '@/lib/user-store';
import { getAllRegisteredLeads } from '@/lib/lead-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const users = getPortalUsers();
    const allLeads = getAllRegisteredLeads();

    const assignedCount = users.reduce((acc, u) => acc + (u.assignedLeadIds?.length || 0), 0);
    const unassignedCount = Math.max(0, allLeads.length - assignedCount);

    return NextResponse.json({
      success: true,
      users,
      stats: {
        totalUsers: users.length,
        globalUsers: users.filter((u) => u.isGlobalUser).length,
        staffUsers: users.filter((u) => !u.isGlobalUser && u.role !== 'admin').length,
        totalLeads: allLeads.length,
        assignedLeadsCount: assignedCount,
        unassignedLeadsCount: unassignedCount,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch portal users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_user') {
      const { username, name, email, password, role, isGlobalUser, department, notes } = body;
      if (!username || !name || !email) {
        return NextResponse.json(
          { success: false, error: 'Username, Name, and Email are required.' },
          { status: 400 }
        );
      }

      const newUser = createPortalUser({
        username,
        name,
        email,
        password,
        role: role || (isGlobalUser ? 'global_user' : 'staff'),
        isGlobalUser: Boolean(isGlobalUser),
        department,
        notes,
      });

      return NextResponse.json({
        success: true,
        message: `User ${newUser.name} created successfully`,
        user: newUser,
        users: getPortalUsers(),
      });
    }

    if (action === 'assign_lead') {
      const { leadId, userId } = body;
      if (!leadId || !userId) {
        return NextResponse.json(
          { success: false, error: 'leadId and userId are required' },
          { status: 400 }
        );
      }

      const result = assignLeadToUser(leadId, userId);
      return NextResponse.json({
        success: true,
        message: `Lead successfully assigned exclusively to ${result.userName}`,
        result,
        users: getPortalUsers(),
      });
    }

    if (action === 'distribute_random') {
      const allLeads = getAllRegisteredLeads();
      const result = distributeRandomLeads(allLeads);

      return NextResponse.json({
        success: true,
        message: `Distributed ${result.distributedCount} random leads across staff with zero duplication!`,
        result,
        users: getPortalUsers(),
      });
    }

    if (action === 'toggle_global') {
      const { userId, isGlobal } = body;
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'userId is required' },
          { status: 400 }
        );
      }

      const updated = toggleGlobalUser(userId, Boolean(isGlobal));
      return NextResponse.json({
        success: true,
        message: `Global status updated for ${updated?.name}`,
        user: updated,
        users: getPortalUsers(),
      });
    }

    if (action === 'delete_user') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'userId is required' },
          { status: 400 }
        );
      }

      const deleted = deletePortalUser(userId);
      return NextResponse.json({
        success: deleted,
        message: deleted ? 'User deleted and leads unassigned' : 'User not found',
        users: getPortalUsers(),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid user management action' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Error processing user action' },
      { status: 500 }
    );
  }
}
