import { NextRequest, NextResponse } from 'next/server';
import { getAllPlans, getPlanById, updatePlanConfig } from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('id');

    if (planId) {
      const plan = getPlanById(planId);
      if (!plan) {
        return NextResponse.json({ success: false, error: 'Plan not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, plan });
    }

    const plans = getAllPlans();
    return NextResponse.json({ success: true, plans });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { planId, updates } = body;

    if (!planId || !updates) {
      return NextResponse.json({ success: false, error: 'Plan ID and updates are required' }, { status: 400 });
    }

    const adminEmail = request.cookies.get('samvero_portal_user')?.value || 'Admin';
    const updatedPlan = updatePlanConfig(planId, updates, adminEmail);

    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update plan' }, { status: 500 });
  }
}
