import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
import { UserStatus } from "./types/enums";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    if (!req.nextauth.token!.status || req.nextauth.token!.status === UserStatus.INACTIVE ){
      return NextResponse.rewrite(new URL('/access_denied', req.url));
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

export const config = { matcher: ["/:path*"] }
