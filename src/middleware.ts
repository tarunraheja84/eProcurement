import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";
import { UserRole } from "./types/enums";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {

    if (req.nextauth.token?.role === "USER" && req.nextUrl.pathname.startsWith('/quotations') ) {
        // alow access the user's role and route to authorize access accordingly
    } else {
        return NextResponse.rewrite(new URL('/access_denied', req.url));
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
