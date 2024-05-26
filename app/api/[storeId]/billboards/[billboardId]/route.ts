import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


// get a single billboard and without authentication
export async function GET (
    req: Request,
    { params } : { params: {billboardId: string}}
) {
    try {
        
        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 })
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        })

        if (!billboard) {
            return new NextResponse("Billboard not found", { status: 404 })
        }

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_GET]: Error: ", error)
        return new NextResponse("An error occurred while fetching the billboard", { status: 500 })
    }
}

// update a single billboard
export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, billboardId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()

        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse("Label is required", { status: 400 })
        }
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 })
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 })
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })


        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_PATCH]: Error: ", error)
        return new NextResponse("An error occurred while updating the billboard", { status: 500 })
    }
}

// create a billboard delete method as well
export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, billboardId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 })
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        })

        if (!billboard) {
            return new NextResponse("Store not found", { status: 404 })
        }

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[STORE_DELETE]: Error: ", error)
        return new NextResponse("An error occurred while deleting the billboard", { status: 500 })
    }
}