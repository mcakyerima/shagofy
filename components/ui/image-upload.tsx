import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon, XCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export interface ImageObject {
    url: string;
}

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (newImages: ImageObject[]) => void;
    onRemove: (url: string) => void;
    initialImages?: ImageObject[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    initialImages
}) => {
    const [images, setImages] = useState<ImageObject[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (initialImages) {
            setImages(initialImages);
        }
    },[initialImages])


    // This is used to get the image url from the cloudinary widget
    const onUpload = (result: any) => {
        // Append the new URL to the existing array of URLs
        const newUrl = result.info.secure_url;
        const newImage = { url: newUrl };

        // Update the local state with the new image
        setImages(prevImages => {
            const updatedImages = [...prevImages, newImage];
            onChange(updatedImages); // Update the form field value
            return updatedImages;
        });
    };

    // Function to handle image removal
    const handleRemove = (url: string) => {
        // Filter out the image with the specified URL
        const updatedImages = images.filter(image => image.url !== url);

        // Update the local state with the filtered images
        setImages(updatedImages);

        // Call the onRemove callback to inform the parent component
        onRemove(url);
        onChange(updatedImages); // Update the form field value
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="flex mb-4 items-center gap-4">
                {images.map((image, index) => (
                    <div key={index}
                        className=" border relative w-[200px] h-[200px] rounded-lg overflow-hidden shadow-sm"
                    >
                         <Button
                            className="z-10 absolute top-2 right-2"  
                            type="button" onClick={() => handleRemove(image.url)} variant="destructive" size="icon">
                            <XCircle className="h-4 w-4"/>
                        </Button>  
                        <Image
                            className="object-cover"
                            alt="Image"
                            fill
                            src={image.url} 
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
    );
};

export default ImageUpload;
