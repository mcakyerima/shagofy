"use client";

import { Size } from "@prisma/client";
import * as z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Loader2, TrashIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/ImageUpload";

const formSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#[0-9A-Fa-f]{4}/, {
      message: "Invalid color value. Must be a hex color code.",
    }),
});

interface ColorFormProps {
  initialData: Size | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  console.log(["INITIAL_DATA: ", initialData]);

  // get the store id in params
  const { storeId, colorId } = useParams();
  const router = useRouter();

  // state for the modal
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // get the useOrigin windo custom hook
  const origin: string = useOrigin();

  // form hook
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  // Mapping the initial data to the form values
  const title = initialData ? "Edit color." : "Create color";
  const description = initialData ? "Edit a color." : "Add a new color";
  const toastMessage = initialData ? "color updated." : "color created";
  const action = initialData ? "Save changes" : "Create";

  // onSubmit function for submitting the form
  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${storeId}/colors/${colorId}`, data);
      } else {
        await axios.post(`/api/${storeId}/colors`, data);
      }

      // refresh the page to update server component
      router.push(`/${storeId}/colors`);
      toast.success(toastMessage);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // onDelete function for deleting store
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      router.push(`/${storeId}/colors`);
      toast.success("Color deleted");
      router.refresh();
    } catch (error) {
      toast.error("Make sure you removed all products using this color first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        item="Color"
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            onClick={() => setOpen(true)}
            className="flex items-center sm:gap-1"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="hidden sm:block">Delete Color</span>
          </Button>
        )}
      </div>
      <Separator className="my-3" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting || loading}
                      {...field}
                      placeholder="Color name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex relative">
                      <Input
                        disabled={form.formState.isSubmitting || loading}
                        {...field}
                        placeholder="Color Hex value"
                      />
                      <div
                        className=" absolute right-2 top-1 shadow-sm p-3 rounded-full border h-5 w-5"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="w-32"
            type="submit"
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              action
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ColorForm;
