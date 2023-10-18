import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import { NextRequest } from "next/server";
import { accessSecret } from "@/utils/utils";

const handler = async (req: NextRequest, res: any) => {
  const secrets = await Promise.all([
    accessSecret("E_PROCUREMENT_APP_NEXTAUTH_SECRET"),
    accessSecret("GOOGLE_CLIENT_ID"),
    accessSecret("GOOGLE_CLIENT_SECRET")
  ])
  const [secretId , clientId, clientSecret] = secrets

  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: clientId as string,
        clientSecret: clientSecret as string,
        profile(profile) {
          return { role: profile.role ?? "user", id: profile.sub , ...profile}
        }
      }),
    ],
    secret: secretId,
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    jwt: {
      secret: secretId,
      maxAge: 24 * 60 * 60,
    },
    callbacks :{
      async jwt({token, user}){
        return { ...token, ...user}
      },
      async session({session ,token, user}){
        session.user = token;
        return session;
      }
    }
  })
}
export {handler as GET, handler as POST}