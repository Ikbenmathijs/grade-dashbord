'use client'

import ApiError from '@/interfaces/apiError';
import User from '@/interfaces/user';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';






export default function LoginButton({onFail, onSuccess} : {onFail?: (status: number | undefined, message: string | undefined) => void, onSuccess?: () => void}) {


    /*useEffect(() => {

    });*/

    

    async function loginUser(googleResponse: CredentialResponse) {
        if (!googleResponse.clientId) return;

        axios.post<User>(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
            token: googleResponse.credential
        }).then((res) => {
            console.log(res.data);
            if (onSuccess) onSuccess();
        }).catch((e: AxiosError) => {
            if (e.response) {
                const res = e.response.data as ApiError;
                if (onFail) onFail(e.status, res.error)
            } else {
                if (onFail) onFail(e.status, undefined);
            }
            
        });


    }




    return (
        <div>
            <GoogleOAuthProvider clientId="714726516267-hn2jg6dl88eset2hbt78p6l74s5smj2v.apps.googleusercontent.com">
                <GoogleLogin onSuccess={loginUser} onError={() => console.log("rip :(")} />
            </GoogleOAuthProvider>
        </div>
    )
}