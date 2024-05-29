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
        const body = await req.json();

        const { 
            name,
            price,
            colorId,
            sizeId,
            categoryId,
            images,
            isFeatured,
            isArchived
        } = body;

        const requiredFields = {
            name: "Name is required",
            price: "Price is required",
            colorId: "Color is required",
            sizeId: "Size is required",
            categoryId: "Category is required"
        };

        for (const [field, errorMessage] of Object.entries(requiredFields)) {
            if (!body[field]) {
                return new NextResponse(errorMessage, { status: 400 });
            }
        }

        if (!images || images.length === 0) {
            return new NextResponse("Images are required and cannot be empty", { status: 400 });
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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                colorId,
                sizeId,
                categoryId,
                isFeatured,
                isArchived,
                storeId: storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })

        return new NextResponse(JSON.stringify(product), { status: 201 });

    } catch (error) {
        console.log('[PRODUCTS_POST_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}

//  Path: app/api/%5BstoreId%5D/billboards/route.ts
export async function GET(
    req:Request,
    { params } : {params: {storeId: string}}
) {
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        const storeId = params.storeId;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        // get the billboards for the store
        const products = await prismadb.product.findMany({
            where: {
                storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured === 'true' ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return new NextResponse(JSON.stringify(products), { status: 200 });

    } catch (error) {
        console.log('[PRODUCTS_GET_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}