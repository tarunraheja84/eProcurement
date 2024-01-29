import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { Inter } from 'next/font/google'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import VendorNavBar from '@/components/VendorNavbar';
import 'primeicons/primeicons.css';
import Providers from '@/components/providers';
import NavBar from '@/components/navbar';
import { getUserSessionData } from '@/utils/utils';
import { UserType } from '@/types/enums';

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
  const isVendorLogin = sessionData?.userType === UserType.VENDOR_USER ? true : false
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          <Providers>
            {
              isVendorLogin ? <VendorNavBar />  : <NavBar />
            }
            <div className='page-container'>
              {children}
            </div>
          </Providers>
        </PrimeReactProvider>
      </body>
    </html>
  )
}
