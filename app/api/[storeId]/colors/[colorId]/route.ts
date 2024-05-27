import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


// get a single billboard and without authentication
export async function GET (
    req: Request,
    { params } : { params: {colorId: string}}
) {
    try {
        
        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 })
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        })

        if (!color) {
            return new NextResponse("Color not found", { status: 404 })
        }

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_GET]: Error: ", error)
        return new NextResponse("An error occurred while fetching the color", { status: 500 })
    }
}

// update a single billboard
export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, colorId: string}}
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

        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 })
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value,
            }
        })


        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_PATCH]: Error: ", error)
        return new NextResponse("An error occurred while updating the Size", { status: 500 })
    }
}

// create a billboard delete method as well
export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, colorId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 })
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        })

        if (!color) {
            return new NextResponse("Color not found", { status: 404 })
        }

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_DELETE]: Error: ", error)
        return new NextResponse("An error occurred while deleting the Size", { status: 500 })
    }
}