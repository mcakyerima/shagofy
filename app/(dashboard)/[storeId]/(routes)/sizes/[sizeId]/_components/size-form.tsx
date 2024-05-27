"use client";

import { Size } from "@prisma/client";
import * as z from "zod";
import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Loader2, TrashIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
});

interface SizeFormProps {
    initialData: Size | null;
}

type SizeFormValues = z.infer<typeof formSchema>; 

const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {
    console.log(['INITIAL_DATA: ', initialData]);

// get the store id in params
const { storeId, sizeId } = useParams();
const router = useRouter();

// state for the modal
const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);

// get the useOrigin windo custom hook
const origin: string = useOrigin();

// form hook
const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: '',
        value: '',
    }
});


// Mapping the initial data to the form values
const title = initialData ? "Edit size." : "Create size";
const description = initialData ? "Edit a size." : "Add a new size";
const toastMessage = initialData ? "Size updated." : "Size created";
const action = initialData ? "Save changes" : "Create";

// onSubmit function for submitting the form
const onSubmit = async (data: SizeFormValues) => {
    try {
        setLoading(true);
        if (initialData) {
            await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data);
        } else {
            await axios.post(`/api/${storeId}/sizes`, data);
        }
        
        // refresh the page to update server component
        router.push(`/${storeId}/sizes`);
        toast.success(toastMessage)
        router.refresh()

    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        setLoading(false);
    }
}

// onDelete function for deleting store
const onDelete = async () => {
    try {
        setLoading(true);
        await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
        router.push(`/${storeId}/sizes`);
        toast.success("Size deleted")
        router.refresh();
    } catch (error) {
        toast.error("Make sure you removed all products using this size first.")
    }finally {
        setLoading(false);
        setOpen(false);
    }
}
    return ( 
        <>
            <AlertModal
                item="Size"
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {
                    initialData && (
                        <Button
                            disabled={loading}
                            variant="destructive"
                            onClick={() => setOpen(true)}
                            className="flex items-center sm:gap-1"
                        >
                            <TrashIcon className="h-4 w-4"/>
                            <span className="hidden sm:block">Delete Size</span>
                        </Button>
                    )
                }           
            </div>
            <Separator className="my-3"/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={form.formState.isSubmitting || loading} 
                                            {...field} 
                                            placeholder="Size name"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={form.formState.isSubmitting || loading} 
                                            {...field} 
                                            placeholder="Size value"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button 
                        className="w-32"
                        type='submit'
                        disabled={form.formState.isSubmitting || loading}
                        >
                        {form.formState.isSubmitting
                        ?
                            <Loader2 className="mr-2 animate-spin"/>
                        : 
                        action
                        }
                    </Button>
                </form>     
            </Form>
        </>
     );
}
 
export default SizeForm;