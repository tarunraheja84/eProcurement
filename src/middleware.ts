import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { UserType } from "./types/enums";
import { decode } from 'next-auth/jwt';
export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const userId = req.cookies.get("userId")?.value;

    if (!userId || !req.nextauth.token || !req.nextauth.token.status || req.nextauth.token.status === UserStatus.INACTIVE) {
      return NextResponse.rewrite(new URL('/access_denied', req.url));
    }

    if (
          //regular expressions has been used here to allow "/vendor" for vendorUser but block "/vendors"
      (!(req.nextUrl.pathname==='/')) && (req.nextauth.token.userType === UserType.VENDOR_USER && !/^\/vendor(\/|$)/.test(req.nextUrl.pathname)) ||
      (req.nextauth.token.userType === UserType.INTERNAL_USER && /^\/vendor(\/|$)/.test(req.nextUrl.pathname))
    ) {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  },
  // This callbacks is used to explicitly logout the user if details not available
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        const vendorId = req.cookies.get("vendorId")?.value
        const decodedSession : UserSession | null = await decode({
          token: req.cookies.get('__Secure-next-auth.session-token')?.value,
          secret: process.env.NEXTAUTH_SECRET!,
        });
        if (!token || !decodedSession) return false;
        if (
            //regular expressions has been used here to allow "/vendor" for vendorUser but block "/vendors"
          (decodedSession?.userType === UserType.VENDOR_USER && /^\/vendor(\/|$)|\/$/.test(req.nextUrl.pathname) && (!vendorId))
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