import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { accessSecret } from "@/utils/utils";
import { logger } from "@/setup/logger";
import prisma from '@/lib/prisma';
import { UserRole } from "@prisma/client";

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
        async profile(profile) {
          let userData:{
            name:string,
            email:string,
            phoneNumber:string,
            role:UserRole
          } = {
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            role:UserRole.USER
          };
          let id = profile.id;
          let user;
          try {
            user = await prisma.internalUser.findUnique({ // check if user already present 
              where : {
                  email : userData.email,
              },
            })
            if (!user) {
              user = await prisma.internalUser.create({ data: userData }); // if user not exist create user with default "USER" role
            }
            id = user.userId;
            userData.role = user.role;
          } catch (error) {
            logger.error(`Error creating user  : ${error}`);
          }
          return { role: userData.role , id: profile.sub , ...profile}
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