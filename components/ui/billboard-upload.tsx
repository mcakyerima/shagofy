"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlusIcon, XCircle } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface BillboardUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const BillboardUpload: React.FC<BillboardUploadProps> = ({
    disabled = false,
    onChange,
    onRemove,
    value,
}) => {
    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    
    const onUpload = (file: any) => {
        onChange(file.info.secure_url)
    }

    if (!isMounted) return null;
    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url, index) => (
                    <div key={index}
                    className=" border relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-sm"
                    >
                    <Button
                        className="z-10 absolute top-2 right-2"  
                        type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                        <XCircle className="h-4 w-4"/>
                    </Button>  
                    <Image
                        className="object-cover"
                        alt="Image"
                        fill
                        src={url} 
                    />
                </div>
                ))}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset="ml_default">

                {({ open }) => {
                    const onClick = () => (
                        open()
                    );
                    return (
                        <Button type="button" onClick={onClick} disabled={disabled} variant="secondary" className="border border-gray-600 border-dashed shadow-md">
                            <ImagePlusIcon className="h-4 w-4 mr-2"/>
                            Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    )
}

export default BillboardUpload;