"use client";

import { DataTable } from "@/components/ui/data.table";
import { OrderColumn, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = (
    data,
) => {
    return ( 
        <>
            <Heading
                title={`Orders (${data.data.length})`}
                description="Manage your orders here."
            />
            <Separator/>
            <DataTable columns={columns} data={data.data} searchKey="products"/>
        </>
     );
}
 
export default OrderClient;