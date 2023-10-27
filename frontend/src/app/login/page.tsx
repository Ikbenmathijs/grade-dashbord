'use client';

import ErrorMessage from "@/components/errorMessage"
import LoginButton from "@/components/loginButton"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function loginPage() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [errorHidden, setErrorHidden] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorTitle, setErrorTitle] = useState("");

    function onLoginError(status: number | undefined, message: string | undefined) {
        let msg = ""
        if (status) msg += `[${status}] `;
        if (message) msg += message;
        setErrorMessage(msg);
        setErrorTitle("Inloggen mislukt!");
        setErrorHidden(false);
    }

    function onLoginSuccess() {
        if (searchParams.has("r")) {
            router.push(searchParams.get("r") as string);
        } else {
            router.push("/");
        }

    }

    
    return (
        <div>
            <div className="h-screen flex justify-center items-center">
                <div className="bg-amber-500 w-64 h-64">
                    <h2 className="m-1">Log in</h2>
                    <LoginButton onFail={onLoginError} onSuccess={onLoginSuccess} />
                </div>
                
            </div>
            <ErrorMessage setHiddenCallback={setErrorHidden} title={errorTitle} desc={errorMessage} hidden={errorHidden} />
        </div>
    )
}