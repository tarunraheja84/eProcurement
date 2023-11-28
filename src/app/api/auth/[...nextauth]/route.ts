import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import NextAuth from "next-auth"
import { NextRequest } from "next/server";
import { accessSecret, companyHostedDomain } from "@/utils/utils";
import { logger } from "@/setup/logger";
import prisma from '@/lib/prisma';
import { InternalUser } from "@prisma/client";
import { UserRole, UserStatus, UserType } from "@/types/enums";
import { VendorUser } from '@/types/vendorUser';

const handler = async (req: NextRequest, res: any) => {
  const secrets = await Promise.all([
    accessSecret("E_PROCUREMENT_APP_NEXTAUTH_SECRET"),
    accessSecret("GOOGLE_CLIENT_ID"),
    accessSecret("GOOGLE_CLIENT_SECRET"),
    accessSecret("APPLE_CLIENT_ID"),
    accessSecret("APPLE_CLIENT_SECRET"),
    accessSecret("FACEBOOK_CLIENT_ID"),
    accessSecret("FACEBOOK_CLIENT_SECRET"),

  ])
  const [secretId, googleClientId, googleClientSecret, appleClientId, appleClientSecret, facebookClientId, facebookClientSecret] = secrets

  return await NextAuth(req, res, {
    providers: [
      // AppleProvider({
      //   clientId: appleClientId as string,
      //   clientSecret: appleClientSecret as string
      // }),
      FacebookProvider({
        clientId: facebookClientId as string,
        clientSecret: facebookClientSecret as string
      }),
      GoogleProvider({
        clientId: googleClientId as string,
        clientSecret: googleClientSecret as string,
        async profile(profile) {
          let userData: any = {
            name: profile.name,
            email: profile.email,
          };
          let user : InternalUser | VendorUser | null;
          try {
            if (profile.hd === companyHostedDomain.domain){ // if domain matched the company hosted domain then consider it is internal user
              user = await prisma.internalUser.findUnique({ // check if user present or not
                where: {
                  email: userData.email,
                },
              })
            }else{
              user = await prisma.vendorUser.findUnique({ // check if user present or not
                where: {
                  email: userData.email,
                },
              })
            }
            if (user) {
              userData.userType = UserType.INTERNAL_USER;
              userData.role = UserRole.USER;
              userData.userId = user?.userId;
              userData.status = user?.status;
            }
          } catch (error) {
            logger.error(`Error creating user  : ${error}`);
          }
          return { role: userData.role, id: profile.sub, ...profile, ...userData }
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
    callbacks: {
      async jwt({ token, user }) {
        return { ...token, ...user }
      },
      async session({ session, token, user }) {
        session.user = token;
        return session;
      }
    }
  })
}
export { handler as GET, handler as POST }
