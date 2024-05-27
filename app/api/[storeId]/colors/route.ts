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
    
        const { name, value } = body

    
        if (!name) { 
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) { 
            return new NextResponse("Value is required", { status: 400 });
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
        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: storeId
            }
        })

        return new NextResponse(JSON.stringify(color), { status: 201 });

    } catch (error) {
        console.log('[COLORS_POST_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}

//  Path: app/api/%5BstoreId%5D/billboards/route.ts
export async function GET(
    req:Request,
    { params } : {params: {storeId: string}}
) {
    try {

        const storeId = params.storeId;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        // get the billboards for the store
        const colors = await prismadb.color.findMany({
            where: {
                storeId
            }
        })

        return new NextResponse(JSON.stringify(colors), { status: 200 });

    } catch (error) {
        console.log('[COLORS_GET_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}