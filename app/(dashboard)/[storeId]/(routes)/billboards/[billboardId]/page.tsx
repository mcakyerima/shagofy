import prismadb from "@/lib/prismadb";
import BillboardForm from "./_components/billboard-form";
import { Billboard } from "@prisma/client";
const BillboardPge = async ({
    params
}: { params: {billboardId: string}}) => {
    console.log({Params: params});

    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    });

    return ( 
        <>
            <div className="flex-col">
                <div className="flex-1 spac-y-4 p-8 pt-6">
                    <BillboardForm initialData={billboard}/>
                </div>
            </div>
        </>
     );
}
 
export default BillboardPge;