"use client"

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"

interface ModalProps {
    title: string
    children: React.ReactNode
    isOpen: boolean
    onClose: () => void
    description: string
}

 export const Modal: React.FC<ModalProps> = ({ 
    children, 
    isOpen, 
    onClose,
    title, 
    description 
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}