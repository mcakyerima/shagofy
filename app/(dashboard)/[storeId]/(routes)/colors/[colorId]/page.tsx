import prismadb from "@/lib/prismadb";
import ColorForm  from "./_components/color-form";
import { Size } from "@prisma/client";
const ColorPage = async ({
    params
}: { params: {colorId: string}}) => {
    // console.log({Params: params});

    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId
        }
    });

    return ( 
        <>
            <div className="flex-col">
                <div className="flex-1 spac-y-4 p-8 pt-6">
                    <ColorForm initialData={color}/>
                </div>
            </div>
        </>
     );
}
 
export default ColorPage;