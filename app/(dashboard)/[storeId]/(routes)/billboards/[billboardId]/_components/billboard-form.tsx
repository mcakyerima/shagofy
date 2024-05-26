"use client";

import { Billboard } from "@prisma/client";
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
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});

interface BillboardFormProps {
    initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>; 

const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    console.log(['INITIAL_DATA: ', initialData]);

// get the store id in params
const { storeId, billboardId } = useParams();
const router = useRouter();

// state for the modal
const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);

// get the useOrigin windo custom hook
const origin: string = useOrigin();

// form hook
const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        label: '',
        imageUrl: '',
    }
});


// Mapping the initial data to the form values
const title = initialData ? "Edit billboard." : "Create billboard";
const description = initialData ? "Edit a billboard." : "Add a new billboard";
const toastMessage = initialData ? "Billboard updated." : "Billboard created";
const action = initialData ? "Save changes" : "Create";

// onSubmit function for submitting the form
const onSubmit = async (data: BillboardFormValues) => {
    try {
        setLoading(true);
        if (initialData) {
            await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data);
        } else {
            await axios.post(`/api/${storeId}/billboards`, data);
        }
        
        // refresh the page to update server component
        router.refresh()
        router.push(`/${storeId}/billboards`);
        toast.success(toastMessage)

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
        await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
        router.refresh();
        router.push(`/${storeId}/billboards`);
        toast.success("Billboard deleted")
    } catch (error) {
        toast.error("Make sure you removed all the categories from this billboard before deleting it.")
    }finally {
        setLoading(false);
        setOpen(false);
    }
}
    return ( 
        <>
            <AlertModal
                item="Billboard"
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
                            <span className="hidden sm:block">Delete Billboard</span>
                        </Button>
                    )
                }           
            </div>
            <Separator className="my-3"/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={form.formState.isSubmitting || loading} 
                                            {...field} 
                                            placeholder="Billboard label"
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
 
export default BillboardForm;