import React from 'react'

const NotFound = () => {
  return (
    <>
   <div className="text-center flex flex-col min-h-[90vh] justify-center items-center ">
    <h1 className="mb-4 text-6xl font-semibold text-custom-red">404</h1>
    <p className="mb-4 text-lg text-custom-gray-4">{`Oops! Looks like you're lost.`}</p>
    <div className="animate-bounce">
      <svg className="mx-auto h-16 w-16 text-custom-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
      </svg>
    </div>
    <p className="mt-4 text-custom-gray-4">{`Let's get you back`} <a href="/" className="text-custom-blue">home</a>.</p>
  </div>

    </>

  )
}

export default NotFound