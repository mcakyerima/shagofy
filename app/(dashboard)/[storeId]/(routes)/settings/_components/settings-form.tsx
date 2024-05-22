"use client";
import { Store } from "@prisma/client";
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

interface SettingsFormProps {
    initialData: Store;
}


const formSchema = z.object({
    name: z.string().min(1)
});

type SettingsFormValues = z.infer<typeof formSchema>; 

const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
// get the store id in params
const { storeId } = useParams();
const router = useRouter();

const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);

const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
})  

const onSubmit = async (data: SettingsFormValues) => {
    try {
        setLoading(true);
        // use axios
        const response = await axios.patch(`/api/stores/${storeId}`, data);
        // refresh the page to update server component
        router.refresh()

        toast.success("Store settings updated")

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
        await axios.delete(`/api/stores/${storeId}`);
        router.refresh();
        router.push("/");
        toast.success("Store deleted")
    } catch (error) {
        toast.error("Make sure you removed all products and orders before deleting the store")
    }finally {
        setLoading(false);
        setOpen(false);
    }
}
    return ( 
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title="Settings"
                    description="Update your store settings"
                />
                <Button
                    disabled={loading}
                    variant="destructive"
                    onClick={() => setOpen(true)}
                    className="flex items-center sm:gap-1"
                >
                    <TrashIcon className="h-4 w-4"/>
                    <span className="hidden sm:block">Delete Store</span>
                </Button>
            </div>
            <Separator/>
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
                                            placeholder="Store Name"
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
                        "Update Settings"
                        }
                    </Button>
                </form>     
            </Form>
        </>
     );
}
 
export default SettingsForm;