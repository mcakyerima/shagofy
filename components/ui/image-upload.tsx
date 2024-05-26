"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cross, ImagePlusIcon, Trash, XCircle } from "lucide-react";
import { CldUploadWidget} from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
    disabled?: boolean
    onChange: (file: string) => void;
    onRemove: (file: string) => void;
    value: string[];
}
const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    // This is used to get the image url from the cloudinary widget
    const onUpload = (result: any) => {
        onChange(result.info.secure_url)
    }

    if(!isMounted) {
        return null
    }
    
    
    return (
        <div>
            <div className="mb-4 items-center gap-4">
                {value.map((url) => (
                    <div key={url}
                        className="relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-sm"
                    >
                    <div className="z-20 abolute top-2 right-2 bg-red-700 h-5 w-5">
                        <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                            <XCircle className=" z-20 w-5 h-5 text-white"/>
                        </Button>
                    </div>   
                    <Image
                        src={url} 
                        className="object-cover"
                        alt="Image"
                        fill
                    />
                    </div>
                ))}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset="ml_default">

                {({open}) => {
                    const onClick = () => (
                        open()
                    )
                    return (
                        <Button type="button" onClick={onClick} disabled={disabled} variant="secondary" className="border border-gray-600 border-dashed shadow-md">
                            <ImagePlusIcon className="h-4 w-4 mr-2"/>
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;