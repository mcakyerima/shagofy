"use client";

import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data.table";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import React from "react";
import { ProductColumn, columns } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
    data: ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> = (
    data,
) => {
    // get router and params
    const router = useRouter();
    const { storeId } = useParams();

    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${data.data.length})`}
                    description="Manage all products in your store."
                />
                <Button onClick={() => router.push(`/${storeId}/products/new`)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable columns={columns} data={data.data} searchKey="label"/>
            <Heading
                title="API"
                description="API calls for Products."
            />
            <Separator/>
            <ApiList entityName="products" entityIdName="productId"/>
        </>
     );
}
 
export default ProductClient;