'use client'

import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';





export default function LoginButton() {


    /*useEffect(() => {

    });*/

    const [name, setName] = useState("");
    

    async function loginUser(googleResponse: CredentialResponse) {
        if (!googleResponse.clientId) return;

        axios.post('http://localhost:8000/api/auth', {
            token: googleResponse.credential
        }).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            //console.log(err);
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