"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin"
}

// we use the `as  Record<ApiAlertProps["variant"], string>` to create a type safe object
// it can also work without the type safe, just making TS happy
const textMap = {
    public: "Public",
    admin: "Admin",
} as  Record<ApiAlertProps["variant"], string>

// we can also use the `objectName: Record<ApiAlertProps["variant"], string>` type to create a type safe object
// this is used to dynamically change the color of the Badge
const variantMap: Record<ApiAlertProps["variant"], BadgeProps['variant']> = {
    public: "secondary",
    admin: "destructive",
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant = "public"
}) => {
    // copy function that when clicked will copy the description
    const onCopy = (description: string) => {
        navigator.clipboard.writeText(description);
        toast.success("API Route Copied to clipboard");
    }

    // state to keep track of copy so that we change copy icon to check if copied
    const [copied, setCopied] = useState(false);
    return (
        <Alert>
            <Server className="h-4 w-4"/>
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="flex mt-4 items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                        onCopy(description); 
                        if (!copied) {
                            setCopied(true);
                        }
                    }}
                >
                    {!copied ? <Copy className="h-4 w-4"/> : <Check className="h-4 w-4"/>}
                </Button>

            </AlertDescription>
        </Alert>
    )
}

 