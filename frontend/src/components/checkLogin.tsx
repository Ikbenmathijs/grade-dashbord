"use client"
import { useEffect } from "react"
import User from "@/interfaces/user"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"




export default function CheckLogin({onSuccess}: {onSuccess?: (user: User) => void}) {

    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {}, {withCredentials: true}).then((res) => {
            if (onSuccess) {
                onSuccess(res.data);
            }
        }).catch((e) => {
            router.push("/login?r=" + pathName);
        });
    });


    return (
        <div>
            
        </div>
    )
}