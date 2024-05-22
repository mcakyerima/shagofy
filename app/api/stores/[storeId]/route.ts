import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()

        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                UserId: userId
            },
            data: {
                name: name
            }
        })

        if (!store) {
            return new NextResponse("Store not found", { status: 404 })
        }

        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORE_PATCH]: Error: ", error)
        return new NextResponse("An error occurred while updating the store settings", { status: 500 })
    }
}

// create a store delete method as well
export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                UserId: userId
            }
        })

        if (!store) {
            return new NextResponse("Store not found", { status: 404 })
        }

        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORE_DELETE]: Error: ", error)
        return new NextResponse("An error occurred while deleting the store", { status: 500 })
    }
}