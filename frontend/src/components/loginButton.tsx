'use client'

import ApiError from '@/interfaces/apiError';
import User from '@/interfaces/user';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import axios, { AxiosError } from 'axios';






export default function LoginButton({onFail, onSuccess} : {onFail?: (status: number | undefined, message: string | undefined) => void, onSuccess?: () => void}) {

    async function loginUser(googleResponse: CredentialResponse) {
        if (!googleResponse.credential) return;

        axios.post<User>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            token: googleResponse.credential
        }, {withCredentials: true
            }).then((res) => {
            console.log(res.data);
            localStorage.setItem("loginToken", googleResponse.credential as string);   
            
            if (onSuccess) onSuccess();

            
        }).catch((e: AxiosError) => {
            if (e.response) {
                if ((e.response.data as Object).hasOwnProperty("error")) {
                    const res = e.response.data as ApiError;
                    if (onFail) onFail(e.status, res.error);
                } else {
                    if (onFail) onFail(e.status, undefined);
                }
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