import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {

    // if (req.nextauth.token?.role === "USER" && (req.nextUrl.pathname.startsWith('/quotations') || req.nextUrl.pathname.startsWith('/vendors') || req.nextUrl.pathname.startsWith('/procurements')|| req.nextUrl.pathname.startsWith('/api')) ) {
    // // alow access the user's role and route to authorize access accordingly
    // } else {
    // return NextResponse.rewrite(new URL('/access_denied', req.url));
    // }
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
