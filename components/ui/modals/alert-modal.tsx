"use client";

import React, { useEffect } from "react";
import { Modal } from "../modal";
import { Button } from "../button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AlertModalProps {
    isOpen: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    loading,
    onClose,
    onConfirm,
}) => {
    const [isMounted, setIsMounted] = React.useState(false);

    useEffect(() => {
        setIsMounted(true)
    },[]);

    // if component did not mount, return null
    if (!isMounted) {
        return null;
    }

    return (
         <Modal
            title="Are you sure you want to delete this store?"
            description="This action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
         >
         <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
                disabled={loading}
                onClick={onClose}
            >
                Cancel
            </Button>
            <Button 
                variant="destructive"
                onClick={onConfirm}
                disabled={loading}
                >
                {loading
                ?
                    <Loader2 className="mr-2 animate-spin"/>
                : 
                "Confirm"
                }
            </Button>
         </div>
            
         </Modal>
    )
}