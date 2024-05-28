"use client";

import { Image, Product, Size, Color, Category } from "@prisma/client";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload, { ImageObject } from "@/components/ui/image-upload";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData,
  categories,
  sizes,
  colors,
}) => {
  // console.log(['INITIAL_DATA: ', initialData]);

  // get the store id in params
  const { storeId, productId } = useParams();
  const router = useRouter();

  // state for the modal
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // get the useOrigin windo custom hook
  const origin: string = useOrigin();

  // form hook
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  // Mapping the initial data to the form values
  const title = initialData ? "Edit product." : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created";
  const action = initialData ? "Save changes" : "Create";

  // onSubmit function for submitting the form
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      // if (initialData) {
      //   await axios.patch(`/api/${storeId}/products/${productId}`, data);
      // } else {
      //   await axios.post(`/api/${storeId}/products`, data);
      // }

      // // refresh the page to update server component
      // router.refresh();
      // router.push(`/${storeId}/products`);
      // toast.success(toastMessage);
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
      await axios.delete(`/api/${storeId}/products/${productId}`);
      router.refresh();
      router.push(`/${storeId}/products`);
      toast.success("Billboard deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all the categories from this billboard before deleting it."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
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
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            onClick={() => setOpen(true)}
            className="flex items-center sm:gap-1"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="hidden sm:block">Delete Billboard</span>
          </Button>
        )}
      </div>
      <Separator className="my-3" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
         <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                        <ImageUpload
                            disabled={loading}
                            onChange={(newImages: ImageObject[]) => {
                                // Update form value with new images
                                field.onChange(newImages);
                            }}
                            onRemove={(url: string) => {
                                // Filter out the removed image
                                const updatedImages = field.value.filter((image: ImageObject) => image.url !== url);
                                // Update form value with remaining images
                                field.onChange(updatedImages);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                  )}
              />
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
                      placeholder="Product name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={form.formState.isSubmitting || loading}
                      {...field}
                      placeholder="99.99"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="categoryId"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                            <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger 
                                        defaultValue={field.value} 
                                        >
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories?.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage/>
                    </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizeId"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Size</FormLabel>
                            <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger 
                                        defaultValue={field.value} 
                                        >
                                        <SelectValue placeholder="Select a size" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sizes?.map((size) => (
                                        <SelectItem
                                            key={size.id}
                                            value={size.id}
                                        >
                                            {size.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage/>
                    </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colorId"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Color</FormLabel>
                            <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger 
                                        defaultValue={field.value} 
                                        >
                                        <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {colors?.map((color) => (
                                        <SelectItem
                                            key={color.id}
                                            value={color.id}
                                        >
                                            {color.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage/>
                    </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-3 space-y-0 p-2 border rounded-lg">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none space-y-1">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the Home page
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-3 space-y-0 p-2 border rounded-lg">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none space-y-1">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will be hidden from the store
                    </FormDescription>
                  </div>
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

export default ProductForm;
