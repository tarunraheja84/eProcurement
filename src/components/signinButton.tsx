"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
const SigninButton = () => {
  const { data: session } = useSession();
  
  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto">
        <p className="text-white text-sm">{session.user.name}</p>
        <button onClick={() => signOut()} className="text-white pi pi-sign-out mr-4"></button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn()} className="text-white ml-auto ">    
      Sign In
    </button>
  );
};

export default SigninButton;
