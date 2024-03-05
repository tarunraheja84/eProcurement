import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { Inter } from 'next/font/google'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import VendorNavBar from '@/components/navbars/VendorNavbar';
import 'primeicons/primeicons.css';
import Providers from '@/app/providers';
import NavBar from '@/components/navbars/Navbar';
import { getUserSessionData } from '@/utils/utils';
import { UserType } from '@/types/enums';
import RolePermissions from './rolePermissions';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Procurement',
  description: 'FlavrFood Sourcing App',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessionData = await getUserSessionData()
  const isVendorLogin = sessionData?.userType === UserType.VENDOR_USER ? true : false;
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <PrimeReactProvider>
          <Providers>
            <RolePermissions>
              <div className="sticky top-0 z-50">
                {isVendorLogin ? <VendorNavBar /> : <NavBar />}
              </div>
              <div className='page-container'>
                {children}
              </div>
            </RolePermissions>
          </Providers>
        </PrimeReactProvider>
      </body>
    </html>
  )
}
