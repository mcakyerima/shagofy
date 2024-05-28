import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { formatPrice } from "@/lib/utils";
import ProductClient from "./_components/client";
import { ProductColumn } from "./_components/columns";

const ProductsPage = async ({
    params
} : {params: { storeId: string}}) => {
    // fetch all billboards
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include : {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // format the billboard before passing
    const formattedProducts: ProductColumn[] = products.map((product) => {
        return {
            id: product.id,
            name: product.label,
            isFeatured: product.isFeatured,
            isArchived: product.isArchived,
            price: formatPrice(product.price.toNumber(), "NGN"),
            category: product.category.name,
            color: product.color.value,
            createdAt: format(product.createdAt, "MMMM do, yyyy"),
        }
    });
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
     );
}
 
export default ProductsPage;