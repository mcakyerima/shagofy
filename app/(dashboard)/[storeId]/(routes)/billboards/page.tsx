import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import BillboardClient from "./_components/client";
import { BillboardColumn } from "./_components/columns";

const BillboardsPage = async ({
    params
} : {params: { storeId: string}}) => {
    // fetch all billboards
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // format the billboard before passing
    const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => {
        return {
            id: billboard.id,
            label: billboard.label,
            createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
        }
    });
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards}/>
            </div>
        </div>
     );
}
 
export default BillboardsPage;