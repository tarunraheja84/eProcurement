'use client'
import axios from 'axios'
import { Button } from 'primereact/button'
import React from 'react'

const Quotaion = () => {

    const handleOrderUpdate = async () => {
        await axios.post("/api/quotations/create")
        alert("quotation accepted successfully")
      }

  return (
    <div>
        <Button onClick={handleOrderUpdate}>
            Accept Quotaion
        </Button>
    </div>
  )
}

export default Quotaion