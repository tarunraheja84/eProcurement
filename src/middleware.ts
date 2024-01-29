import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { UserType } from "./types/enums";
import { getUserSessionData } from "./utils/utils";
import { decode } from 'next-auth/jwt';

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    if (!req.nextauth.token || !req.nextauth.token.status || req.nextauth.token.status === UserStatus.INACTIVE) {
      return NextResponse.rewrite(new URL('/access_denied', req.url));
    }
    if (req.nextUrl.pathname === '/' || (req.nextauth.token.userType === UserType.VENDOR_USER && req.nextUrl.pathname.endsWith('/manage_users/create'))){
      return NextResponse.next()
    }
    if (
      (req.nextauth.token.userType === UserType.VENDOR_USER && !req.nextUrl.pathname.startsWith('/vendor')) ||
      (req.nextauth.token.userType === UserType.INTERNAL_USER && req.nextUrl.pathname.startsWith('/vendor'))
    ) {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  },

  // This callbacks is used to explicitly logout the user if details not available
  
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        const vendorId = req.cookies.get("vendorId")?.value
        const userId = req.cookies.get("userId")?.value
        const decodedSession : UserSession | null = await decode({
          token: req.cookies.get('next-auth.session-token')?.value,
          secret: process.env.NEXTAUTH_SECRET!,
        });
        if (!token || !userId || !decodedSession) return false;

        if (
          (decodedSession?.userType === UserType.VENDOR_USER && req.nextUrl.pathname.startsWith('/vendor') && (!vendorId))
        ) {
          return false
        }
        return true
      }
    }
  }
)

export const config = { matcher: [
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  '/((?!api|_next/static|_next/image|favicon.ico).*)',
], }
