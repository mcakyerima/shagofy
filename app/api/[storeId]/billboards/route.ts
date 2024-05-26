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
    
        const { label, imageUrl } = body

    
        if (!label) { 
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) { 
            return new NextResponse("Image Url is required", { status: 400 });
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: storeId
            }
        })

        return new NextResponse(JSON.stringify(billboard), { status: 201 });

    } catch (error) {
        console.log('[BILLBOARDS_POST_ERROR]', error);
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
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId
            }
        })

        return new NextResponse(JSON.stringify(billboards), { status: 200 });

    } catch (error) {
        console.log('[BILLBOARDS_GET_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}