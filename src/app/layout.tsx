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
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Procurement',
  description: 'FlavrFood Sourcing App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          <Providers>
            {/* <VendorNavBar /> */}
            <NavBar />
            <div className='page-container'>
              {children}
            </div>
          </Providers>
        </PrimeReactProvider>
      </body>
    </html>
  )
}
