import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

/**
 * Retrieves details of a single product without requiring authentication.
 * 
 * @param req - The incoming request object.
 * @param params - The parameters from the request URL.
 * @param params.storeId - The ID of the store.
 * @param params.productId - The ID of the product to retrieve.
 * @returns - The response containing the product details or an error message.
 */
export async function GET(req: Request, { params }: {
    params: {
        storeId: string;
        productId: string;
    }
}): Promise<NextResponse<unknown>> {
    try {
        // Check if productId is provided
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        // Find the product with the specified ID and include related data (images, category, color, size)
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            }
        });

        // If product is not found, return a 404 Not Found response
        if (!product) {
            return new NextResponse("Product not found", { status: 404 });
        }

        // Return the product details as a JSON response
        return NextResponse.json(product);

    } catch (error) {
        // Log any errors and return a 500 Internal Server Error response
        console.log("[PRODUCT_GET]: Error:", error);
        return new NextResponse("An error occurred while fetching the product", { status: 500 });
    }
}


/**
 * Updates a single product with the provided details.
 * 
 * @param req - The incoming request object.
 * @param params - The parameters from the request URL.
 * @param params.storeId - The ID of the store.
 * @param params.productId - The ID of the product to update.
 * @returns - The response containing the updated product or an error message.
 */
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
): Promise<NextResponse<unknown>>  {
    try {
        // Authenticate user
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Parse request body
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

        // Define required fields and their error messages
        const requiredFields = {
            name: "Name is required",
            price: "Price is required",
            colorId: "Color is required",
            sizeId: "Size is required",
            categoryId: "Category is required"
        };

        // Check for missing required fields
        for (const [field, errorMessage] of Object.entries(requiredFields)) {
            if (!body[field]) {
                return new NextResponse(errorMessage, { status: 400 });
            }
        }

        // Check for valid images array
        if (!images || images.length === 0) {
            return new NextResponse("Images are required and cannot be empty", { status: 400 });
        }

        // Check for product ID in parameters
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        // Validate that the store belongs to the authenticated user
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                UserId: userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Store not found", { status: 404 });
        }

        // Update the product's basic details and delete existing images
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                colorId,
                sizeId,
                categoryId,
                images: {
                    deleteMany: {} // Deletes all existing images for this product
                },
                isFeatured,
                isArchived
            }
        });

        // Recreate the product's images with the new data
        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: images.map((image: {url: string}) => image)
                    }
                }
            }
        });

        // Return the updated product
        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_PATCH]: Error:", error);
        return new NextResponse("An error occurred while updating the product", { status: 500 });
    }
}


/**
 * Deletes a single product.
 * 
 * @param req - The incoming request object.
 * @param params - The parameters from the request URL.
 * @param params.storeId - The ID of the store.
 * @param params.productId - The ID of the product to delete.
 * @returns - The response indicating success or failure of the deletion operation.
 */
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
): Promise<NextResponse<unknown>> {
    try {
        const { userId }  = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 })
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 })
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })

        if (!product) {
            return new NextResponse("Store not found", { status: 404 })
        }

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_DELETE]: Error: ", error)
        return new NextResponse("An error occurred while deleting the product", { status: 500 })
    }
}