import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { formatPrice } from "@/lib/utils";
import OrderClient from "./_components/client";
import { OrderColumn } from "./_components/columns";

const OrdersPage = async ({
    params
} : {params: { storeId: string}}) => {
    // fetch all orders
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // format the billboard before passing
    const formattedOrders: OrderColumn[] = orders.map((order) => {
        const total = order.orderItems.reduce((total, order) => total + Number(order.product.price), 0)
        return {
            id: order.id,
            phone: order.phone,
            address: order.address,
            isPaid: order.isPaid,
            totalPrice: formatPrice(total, "NGN"),
            products: order.orderItems.map((orderItem) => orderItem.product.name).join(', '),
            createdAt: format(order.createdAt, "MMMM do, yyyy"),
        }
    });
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders}/>
            </div>
        </div>
     );
}
 
export default OrdersPage;