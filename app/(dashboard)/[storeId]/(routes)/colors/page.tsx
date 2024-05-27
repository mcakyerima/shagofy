import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import ColorsClient from "./_components/client";
import { ColorColumn } from "./_components/columns";

const ColorsPage = async ({
    params
} : {params: { storeId: string}}) => {
    // fetch all billboards
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // format the billboard before passing
    const formattedColors: ColorColumn[] = colors.map((color) => {
        return {
            id: color.id,
            name: color.name,
            value: color.value,
            createdAt: format(color.createdAt, "MMMM do, yyyy"),
        }
    });
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formattedColors}/>
            </div>
        </div>
     );
}
 
export default ColorsPage;