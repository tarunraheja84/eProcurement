import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
import { UserRole } from "./types/enums";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {

    if (req.nextauth.token?.role === "ADMIN" && req.nextUrl.pathname.startsWith('/') ) {
      return NextResponse.rewrite(new URL('/access_denied', req.url));
    } else {
        // alow access the user's role and route to authorize access accordingly
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.role === UserRole.USER || token?.role === UserRole.ADMIN || token?.role === UserRole.MANAGER;
      },
    },
  }
)

export const config = { matcher: ["/:path*"] }
