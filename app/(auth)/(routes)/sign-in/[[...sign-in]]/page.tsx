"use client";
 
import { useState, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <SignIn path="/sign-in" />;
}