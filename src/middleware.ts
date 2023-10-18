import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {

    if (req.nextauth.token?.role === "user" && req.nextUrl.pathname.startsWith('/quotations') ) {
        // alow access the user's role and route to authorize access accordingly
    } else {
        return NextResponse.rewrite(new URL('/access_denied', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.role === "user" || token?.role === "admin" || token?.role === "manager";
      },
    },
  }
)

export const config = { matcher: ["/quotations/create", "/quotations", "/"] }
