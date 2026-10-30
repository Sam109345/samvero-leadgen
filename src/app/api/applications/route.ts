import { NextRequest, NextResponse } from 'next/server';
import {
  submitCustomerApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from '@/lib/saas-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = submitCustomerApplication({
      fullName: body.fullName,
      businessName: body.businessName,
      email: body.email,
      whatsapp: body.whatsapp,
      country: body.country,
      companyWebsite: body.companyWebsite,
      planId: body.planId,
      billingDuration: body.billingDuration || 'monthly',
      serviceRequirements: body.serviceRequirements,
      additionalMessage: body.additionalMessage,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application received successfully',
      application: result.application,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('samvero_portal_role')?.value;
    const token = request.cookies.get('samvero_portal_token')?.value;

    if (!token || (roleCookie !== 'admin' && roleCookie !== 'super_admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const app = getApplicationById(id);
      if (!app) {
        return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, application: app });
    }

    const applications = getAllApplications();
    return NextResponse.json({ success: true, applications });
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
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Application ID and status are required' }, { status: 400 });
    }

    const adminEmail = request.cookies.get('samvero_portal_user')?.value || 'Admin';
    const updated = updateApplicationStatus(id, status, adminNotes, adminEmail);

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update application' }, { status: 500 });
  }
}
