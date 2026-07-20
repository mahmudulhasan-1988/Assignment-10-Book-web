import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
    [key: string]: any;
  };
  session: {
    id: string;
    [key: string]: any;
  };
}

/**
 * Verify JWT token from cookie and return the session.
 * Throws a NextResponse (401) if authentication fails.
 */
export async function verifyAuth(request: NextRequest): Promise<AuthSession> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    throw NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return session as AuthSession;
}

/**
 * Verify JWT token and check if user has one of the allowed roles.
 * Throws a NextResponse (401 or 403) if check fails.
 */
export async function verifyAuthRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<AuthSession> {
  const session = await verifyAuth(request);

  if (!allowedRoles.includes(session.user.role || "")) {
    throw NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return session;
}
