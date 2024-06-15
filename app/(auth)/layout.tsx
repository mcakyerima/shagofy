"use client";
 
import { useState, useEffect } from "react";

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) {
      return null;
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            {children}
        </div>
    )

}