import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server'

export async function POST(
    req:Request
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const body = await req.json()
    
        const { name, address } = body

    
        if (!name) { 
            return new NextResponse("Missing name", { status: 400 });
        }

        const store = await prismadb.store.create({
            data: {
                name,
                address,
                UserId: userId
            }
        })

        return new NextResponse(JSON.stringify(store), { status: 201 });

    } catch (error) {
        console.log('[STORES_POST_ERROR]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}