'use client'
import React from 'react'
import axios from 'axios'

const Order = () => {
    const handleOrderUpdate = async () => {
        await axios.post("/api/orders/update_order")
        alert("order updated successfully")
      }
  return (
    <>
    <button onClick={handleOrderUpdate}>update order</button>
    </>
  )
}

export default Order