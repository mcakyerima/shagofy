"use client"
import { useEffect } from 'react';

import { Modal } from '@/components/ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { 
  SignInButton, 
  SignOutButton, 
  SignedOut, 
  UserButton 
} from '@clerk/nextjs';

 const SetupPage = () => {
  // import the useStoreModal hook 
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])
   
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        ROOT PAGE
    </main>
  );
}

export default SetupPage;