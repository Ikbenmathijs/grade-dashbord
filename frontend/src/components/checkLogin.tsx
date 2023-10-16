"use client"
import { useEffect } from "react"
import User from "@/interfaces/user"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"




export default function CheckLogin() {

    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {}, {withCredentials: true}).then((res) => {

        }).catch((e) => {
            router.push("/login?r=" + pathName);
        });
    });


    return (
        <div>
            
        </div>
    )
}