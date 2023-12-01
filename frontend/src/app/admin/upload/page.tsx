'use client'
import { useState } from "react";
import axios from "axios";

export default function uploadPage() {

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedFile) return;

        let data = {
            file: selectedFile
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sheets/import`, data, {withCredentials: true}).then((response) => {
            console.log(response.data);
        }).catch((e) => {
            console.log(e);
        });
    }


    return (<>
        <form onSubmit={onSubmit}>
            <input type="file" name="file" accept=".xlsx" onChange={(e) => {setSelectedFile(e.target.files?.[0])}}  />
            <input type="submit" value="Upload" />
        </form>
    </>)
}