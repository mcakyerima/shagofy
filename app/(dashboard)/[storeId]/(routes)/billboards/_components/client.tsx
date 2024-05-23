"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const BillboardClient = () => {
    // get router and params
    const router = useRouter();
    const { storeId } = useParams();

    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Billboards"
                    description="Manage your billboards here."
                />
                <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
        </>
     );
}
 
export default BillboardClient;