import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { Children } from "react"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: {storeId: string}
}) {
  const { userId } = auth();

  if (!userId){
    redirect("/sign-in");
  }

  // check if there is a store with the provided storeId
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      UserId: userId
    }
  });

  // if no store, redirect back to "/"
  if (!store) { 
    redirect("/");
  }

  return (
    <>
      <div>This is a nav bar</div>
      {children}
    </>
  )
}