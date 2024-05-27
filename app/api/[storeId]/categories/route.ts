import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server'

export async function POST(
    req:Request,
    { params } : {params: {storeId: string}}
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        const body = await req.json()
    
        const { name, billboardId } = body

    
        if (!name) { 
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) { 
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        // get the store id from the params
        const storeId = params.storeId;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        // check if the store exists for the user
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                UserId: userId
            }
        })

        // if the user does not own the store return 404
        if (!storeByUserId) {
            return new NextResponse("Store not found", { status: 404 });
        }

        // create the billboard
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: storeId
            }
        })

        return new NextResponse(JSON.stringify(category), { status: 201 });

    } catch (error) {
        console.log('[CATEGORY_POST_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}

//  Path: app/api/%5BstoreId%5D/billboards/route.ts
export async function GET(
    req: Request,
    { params } : {params: {storeId: string}}
) {
    try {

        const storeId = params.storeId;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        // get the billboards for the store
        const category = await prismadb.category.findMany({
            where: {
                storeId
            }
        })

        return new NextResponse(JSON.stringify(category), { status: 200 });

    } catch (error) {
        console.log('[CATEGORY_GET_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}