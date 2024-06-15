"use client"

// this page only renders when there is no store, so as soon as this component mounts, the use effect alters 
// the zustand useStoreModal state and triggers the store-modal which is then popped up to the screen using the modalProvider located
// in the root layout. as soon as a store is created, the modal's onSubmit function redirects to /:storeId
import { useEffect } from 'react';
import { useStoreModal } from '@/hooks/use-store-modal';

 const SetupPage = () => {
  // import the useStoreModal hook 
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])
   
  return null;
}

export default SetupPage;