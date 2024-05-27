import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


// get a single billboard and without authentication
export async function GET (
    req: Request,
    { params } : { params: {sizeId: string}}
) {
    try {
        
        if (!params.sizeId) {
            return new NextResponse("Billboard ID is required", { status: 400 })
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        })

        if (!size) {
            return new NextResponse("Size not found", { status: 404 })
        }

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_GET]: Error: ", error)
        return new NextResponse("An error occurred while fetching the billboard", { status: 500 })
    }
}

// update a single billboard
export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, sizeId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()

        const { name, value } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }
        if (!value) {
            return new NextResponse("Value is required", { status: 400 })
        }

        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                UserId: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Store not found", { status: 404 })
        }

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            }
        })


        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_PATCH]: Error: ", error)
        return new NextResponse("An error occurred while updating the Size", { status: 500 })
    }
}

// create a billboard delete method as well
export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, sizeId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                UserId: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Store not found", { status: 404 })
        }

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        })

        if (!size) {
            return new NextResponse("Size not found", { status: 404 })
        }

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_DELETE]: Error: ", error)
        return new NextResponse("An error occurred while deleting the Size", { status: 500 })
    }
}