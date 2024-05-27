"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";
import { ApiAlert } from "../api-alert";

interface ApiListProps {
    entityName: string
    entityIdName: string
}
export const ApiList: React.FC<ApiListProps> = ({
    entityIdName,
    entityName
}) => {
    const {storeId} = useParams();
    const origin = useOrigin();
    const baseUrl = `${origin}/api/${storeId}`

    return ( 
        <>
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
             <ApiAlert
                title="POST"
                variant="admin"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
        </>
    )
}