import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import { NextRequest } from "next/server";
import { accessSecret } from "@/utils/utils";

const handler = async (req: NextRequest, res: any) => {
  // const secrets = await Promise.all([
  //   accessSecret("NEXTAUTH_SECRET"),
  //   accessSecret("GOOGLE_CLIENT_ID"),
  //   accessSecret("GOOGLE_CLIENT_SECRET")
  // ])
  const [secretId , clientId, clientSecret] = ["FVp+sDiHafss5y9W3hRDyx4lZ9INzzFZoyQ22tCTIEs=", process.env.GOOGLE_CLIENT_ID , process.env.GOOGLE_CLIENT_SECRET]

  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: clientId as string,
        clientSecret: clientSecret as string
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
  })
}
export {handler as GET, handler as POST}