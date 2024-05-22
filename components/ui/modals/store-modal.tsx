"use client";

import * as z from 'zod';
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Button } from '../button';
import { Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast';

// define schema
const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const [ loading , setLoading ] = useState(false);
    
    // use theuseStoreModal from zustand
    const storeModal = useStoreModal();
    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:""
        }
    });
const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setLoading(true);
        const response = await axios.post('/api/stores', values);
        // redirect to /:id 
        window.location.assign(`/${response.data.id}`);

    } catch (error) {
        toast.error('Something went wrong!')
    } finally {
        setLoading(false)
    }
}
    return (
        <Modal
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
            title="Create store"
            description="Create a store to start selling your products."
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={form.formState.isSubmitting || loading} 
                                                placeholder='E-commerce' 
                                                {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className='pt-5 space-x-2 flex items-center justify-end w-full'>
                                <Button 
                                    variant="outline" 
                                    onClick={storeModal.onClose}
                                    disabled={form.formState.isSubmitting || loading}
                                    >
                                        Cancel
                                </Button>
                                <Button 
                                    type='submit'
                                    disabled={form.formState.isSubmitting || loading}
                                    >
                                    {form.formState.isSubmitting
                                    ?
                                     <Loader2 className="mr-2 animate-spin"/>
                                    : 
                                    "Create"
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}