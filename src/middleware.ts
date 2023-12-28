import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { UserType } from "./types/enums";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    if (!req.nextauth.token || !req.nextauth.token.status || req.nextauth.token.status === UserStatus.INACTIVE) {
      return NextResponse.rewrite(new URL('/access_denied', req.url));
    }
    if (req.nextauth.token.userType === UserType.VENDOR_USER && req.nextUrl.pathname.startsWith('/admin/vendors')){
      return NextResponse.next()
    }
    if (req.nextUrl.pathname === '/') return NextResponse.next() 
    
    if (
      (req.nextauth.token.userType === UserType.VENDOR_USER && !req.nextUrl.pathname.startsWith('/vendor')) ||
      (req.nextauth.token.userType === UserType.INTERNAL_USER && req.nextUrl.pathname.startsWith('/vendor'))
    ) {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  },
  {
    // callbacks: {
    //   authorized: ({ token }) => {
    //     return token?.role === UserRole.USER || token?.role === UserRole.ADMIN || token?.role === UserRole.MANAGER;
    //   },
    // },
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
