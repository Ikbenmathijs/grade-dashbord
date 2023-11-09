"use client"

import CheckLogin from "@/components/checkLogin"
import LogoutButton from "@/components/logoutButton"
import { useEffect, useState } from "react"
import axios from "axios";

export default function TestPage() {

  const [text, setText] = useState("");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/testResults`).then((response) => {
      console.log(response.data);
      setText(response.data);
    }).catch((e) => {
      setText("Error: " + e.data);
      throw e;
    });
  }, []);

    return (
      <div>
        <CheckLogin />

        <h1>Test page</h1>
        <p>Only accessable to logged in users!</p>

        <p>{text}</p>
        <br />
        <br />
        <br />
        <LogoutButton />
      </div>
    )
  }