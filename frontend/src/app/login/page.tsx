'use client';

import ErrorMessage from "@/components/errorMessage"
import LoginButton from "@/components/loginButton"
import { useState } from "react";
import Router, { useRouter } from "next/navigation";

export default function loginPage() {

    const router = useRouter();

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
        router.push("/");
    }

    
    return (
        <div>
            <LoginButton onFail={onLoginError} onSuccess={onLoginSuccess} />
            <ErrorMessage setHiddenCallback={setErrorHidden} title={errorTitle} desc={errorMessage} hidden={errorHidden} />
        </div>
    )
}