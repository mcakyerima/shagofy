import prismadb from "@/lib/prismadb";
import SizeForm from "./_components/size-form";
import { Size } from "@prisma/client";
const SizePage = async ({
    params
}: { params: {sizeId: string}}) => {
    // console.log({Params: params});

    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    });

    return ( 
        <>
            <div className="flex-col">
                <div className="flex-1 spac-y-4 p-8 pt-6">
                    <SizeForm initialData={size}/>
                </div>
            </div>
        </>
     );
}
 
export default SizePage;