import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
    params: { storeId: string }
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
}) => {
    // fetch the store where params.storeId
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    });

    const name = store?.name
    return (
        <div>
            Active Store: {name}
        </div>
    );
}


export default DashboardPage;