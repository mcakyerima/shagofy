"use client";

import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data.table";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import React from "react";
import { BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
    data: BillboardColumn[]
}

const BillboardClient: React.FC<BillboardClientProps> = (
    data,
) => {
    // get router and params
    const router = useRouter();
    const { storeId } = useParams();

    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.data.length})`}
                    description="Manage your billboards here."
                />
                <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable columns={columns} data={data.data} searchKey="label"/>
        </>
     );
}
 
export default BillboardClient;