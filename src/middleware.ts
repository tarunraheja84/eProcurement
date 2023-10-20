import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

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
        return token?.role === "USER" || token?.role === "ADMIN" || token?.role === "MANAGER";
      },
    },
  }
)

export const config = { matcher: ["/:path*"] }
