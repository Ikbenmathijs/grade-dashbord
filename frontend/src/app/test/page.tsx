"use client"

import CheckLogin from "@/components/checkLogin"
import LogoutButton from "@/components/logoutButton"
import { useEffect, useState } from "react"
import axios from "axios";
import User from "@/interfaces/user";

export default function TestPage() {

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/testResults`, {withCredentials: true}).then((response) => {
      setText(response.data);
      console.log(response.data);
    }).catch((e) => {
      setText("Error: " + e.data);
      //throw e;
    });
  }, []);


  function onUserFetched(user: User) {
    if (user.firstName) {
      setName(user.firstName);
      if (user.lastName) {
        setFullName(user.firstName + " " + user.lastName);
      } else {
        setFullName(user.firstName);
      }
    } else {
      setName(user.email);
      setFullName(user.email);
    }

  }

    return (
      <div>
        <div className="bg-white rounded-lg p-7 w-1/4 m-16">
          <b className="text-slate-700 text-2xl">Welkom {name}!</b>
          <p className="text-slate-500">Dashbord van {fullName}</p>
        </div>
        <CheckLogin onSuccess={onUserFetched} />

        <h1>Test page</h1>
        <p>Only accessable to logged in users!</p>

        <p>{text.toString()}</p>
        <br />
        <br />
        <br />
        <LogoutButton />
      </div>
    )
  }