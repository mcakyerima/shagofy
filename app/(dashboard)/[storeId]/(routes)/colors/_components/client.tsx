"use client";

import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data.table";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import React from "react";
import { ColorColumn, columns } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface ColorsClientProps {
    data: ColorColumn[]
}

const ColorsClient: React.FC<ColorsClientProps> = (
    data,
) => {
    // get router and params
    const router = useRouter();
    const { storeId } = useParams();

    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Colors (${data.data.length})`}
                    description="Manage your colors here."
                />
                <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable columns={columns} data={data.data} searchKey="name"/>
            <Heading
                title="API"
                description="API calls for colors."
            />
            <Separator/>
            <ApiList entityName="colors" entityIdName="colorId"/>
        </>
     );
}
 
export default ColorsClient;