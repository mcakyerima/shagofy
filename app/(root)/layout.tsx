import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // get the store for user, if n store, redirect user to store creation modal
    const store = await prismadb.store.findFirst({
        where: {
            UserId: userId
        }
    });

    // if the store exist, take user to (dashboard)[storeId] page
    if (store) {
        redirect(`/${store.id}`)
    }

    // if the store does not exist, take user to store creation modal
    return (
        <>
            {children}
        </>
    )
}