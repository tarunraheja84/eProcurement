import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import NextAuth from "next-auth"
import { NextRequest } from "next/server";
import { accessSecret, companyHostedDomain } from "@/utils/utils";
import prisma from '@/lib/prisma';
import { UserType } from "@/types/enums";
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { UserRole, UserStatus } from '@prisma/client';

const handler = async (req: NextRequest, res: any) => {
//   const secrets = await Promise.all([
//     accessSecret("E_PROCUREMENT_APP_NEXTAUTH_SECRET"),
//     accessSecret("GOOGLE_CLIENT_ID"),
//     accessSecret("GOOGLE_CLIENT_SECRET"),
//     accessSecret("APPLE_CLIENT_ID"),
//     accessSecret("APPLE_CLIENT_SECRET"),
//     accessSecret("FACEBOOK_CLIENT_ID"),
//     accessSecret("FACEBOOK_CLIENT_SECRET"),

//   ])
//   const [secretId, googleClientId, googleClientSecret, appleClientId, appleClientSecret, facebookClientId, facebookClientSecret] = secrets
  return await NextAuth(req, res, {
    providers: [
      // AppleProvider({
      //   clientId: appleClientId as string,
      //   clientSecret: appleClientSecret as string
      // }),
      // FacebookProvider({
      //   clientId: "420259370363915",
      //   clientSecret: "c7bf700bc7245d5a290cca73885564db"
      // }),
      GoogleProvider({
        clientId: "629576533176-hvmt4f3m51jindk8d5vcv4sqae8j3liu.apps.googleusercontent.com",
        clientSecret: "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",
        async profile(profile) {
          let userData: any = {
            email: profile.email,
          };
          let user : User | null;
          const cookieStore = cookies();

          // try {
          //   if (profile.hd === companyHostedDomain.domain){ // if domain matched the company hosted domain then consider it is internal user
          //     user = await prisma.internalUser.findUnique({ // check if user present or not
          //       where: {
          //         email: userData.email,
          //       },
          //     })
          //     userData.userType = UserType.INTERNAL_USER;
          //   }else{
          //     user = await prisma.vendorUser.findUnique({ // check if user present or not
          //       where: {
          //         email: userData.email,
          //       },
          //     })
          //     userData.userType = UserType.VENDOR_USER;
          //     cookieStore.set("vendorId", user?.vendorId ?? "")
          //   }
          //   if (user) {
          //     userData.name = user.name;
          //     userData.role = user.role;
          //     userData.userId = user?.userId;
          //     userData.status = user?.status;
          //     cookieStore.set("userId", user?.userId ?? "")
          //   }
          // } catch (error) {
          //   console.log('error  :>> ', error);
          // }
            //rough-code
          try{
            user = await prisma.vendorUser.findUnique({ 
              where: {
                email: userData.email,
              },
            })
            if(user){
              userData.userType = UserType.VENDOR_USER;
              cookieStore.set("vendorId", user?.vendorId ?? "")
            }
            else{
              userData.userType = UserType.INTERNAL_USER;
            }
              userData.name = profile.name;
              userData.email = profile.email;
              userData.role = UserRole.ADMIN;
              userData.userId = profile.name;
              userData.status = UserStatus.ACTIVE;
              cookieStore.set("userId", userData.userId)
          } catch (error) {
            console.log('error  :>> ', error);
          }

          return { role: userData.role, id: profile.sub, ...profile, ...userData }
        }
      }),
    ],

    secret: "FVp+sDiHafss5y9W3hRDyx4lZ9INzzFZoyQ22tCTIEs=",
    session: {
      strategy: 'jwt',
      maxAge: 24 * 60 * 60,
    },
    jwt: {
      secret: "FVp+sDiHafss5y9W3hRDyx4lZ9INzzFZoyQ22tCTIEs=",
      maxAge: 24 * 60 * 60,
    },
    callbacks: {
      async jwt({ token, trigger,user, session }) {
        if (trigger === "update"){
          return {...token, ...session.user}
        }
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
