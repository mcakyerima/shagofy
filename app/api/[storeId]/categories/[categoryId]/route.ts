import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// get a single billboard and without authentication
export async function GET (
    req: Request,
    { params } : { params: {categoryId: string}}
) {
    try { 
        
        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true
            }
        })

        if (!category) {
            return new NextResponse("Category not found", { status: 404 })
        }

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_GET]: Error: ", error)
        return new NextResponse("An error occurred while fetching the billboard", { status: 500 })
    }
}

// update a single billboard
export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, categoryId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()

        const { name, billboardId } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }
        if (!billboardId) {
            return new NextResponse("Billlboard ID is required", { status: 400 })
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
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

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
            }
        })


        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_PATCH]: Error: ", error)
        return new NextResponse("An error occurred while updating the billboard", { status: 500 })
    }
}

// create a billboard delete method as well
export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, categoryId: string}}
) {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        })

        if (!category) {
            return new NextResponse("Category not found", { status: 404 })
        }

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_DELETE]: Error: ", error)
        return new NextResponse("An error occurred while deleting the billboard", { status: 500 })
    }
}
 