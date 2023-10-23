"use client"
import React from 'react'
import ProcurementForm from '@/components/procurementForm'
import { SelectedProductsProvider } from '@/contexts/SelectedProductsContext'

const page = () => {
  return (
    <div>
      <SelectedProductsProvider>
      <ProcurementForm />
      </SelectedProductsProvider>
    </div>
  )
}

export default page
