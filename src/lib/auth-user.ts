import { NextRequest } from 'next/server';
import { getAuthenticatedSession } from './session';

export interface EffectiveUser {
  userId: string;
  role: 'super_admin' | 'admin' | 'customer' | 'employer';
  email: string;
  name: string;
}

export function getEffectiveUser(request: NextRequest): EffectiveUser {
  const session = getAuthenticatedSession(request);
  if (session && session.userId) {
    return {
      userId: session.userId,
      role: session.role,
      email: session.email,
      name: session.name,
    };
  }

  // Check direct user ID cookie
  const cookieUserId = request.cookies.get('samvero_user_id')?.value;
  const cookieRole = (request.cookies.get('samvero_portal_role')?.value || 'admin') as any;
  const cookieUser = request.cookies.get('samvero_portal_user')?.value || 'User';

  if (cookieUserId) {
    return {
      userId: cookieUserId,
      role: cookieRole,
      email: cookieRole === 'admin' ? 'sameer.centric@gmail.com' : `${cookieUserId}@samvero.com`,
      name: cookieUser,
    };
  }

  // Fallback for default admin workstation in local development
  return {
    userId: 'user-sameer',
    role: 'admin',
    email: 'sameer.centric@gmail.com',
    name: 'Sameer (Executive Admin)',
  };
}
