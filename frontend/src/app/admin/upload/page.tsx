'use client'
import { useState } from "react";
import axios from "axios";
import ErrorMessage from "@/components/errorMessage";
import SuccessMessage from "@/components/successMessage";

export default function uploadPage() {

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [errorMessageDesc, setErrorMessageDesc] = useState("");
    const [errorMessageTitle, setErrorMessageTitle] = useState("");
    const [errorMessageHidden, setErrorMessageHidden] = useState(true);
    const [successMessageDesc, setSuccessMessageDesc] = useState("");
    const [successMessageTitle, setSuccessMessageTitle] = useState("");
    const [successMessageHidden, setSuccessMessageHidden] = useState(true);


    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedFile) return;

        console.log(selectedFile);

        let data = new FormData();
        data.append("sheet", selectedFile);


        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sheets/import`, data, {
            withCredentials: true, 
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            setSuccessMessageTitle("Success!");
            setSuccessMessageDesc("De gegevens zijn succesvol geïmporteerd vanuit de spreadsheet!");
            setSuccessMessageHidden(false);
        }).catch((e) => {
            console.log(e.data);
            setErrorMessageTitle("Er is iets mis gegaan!");
            if (e.response?.data?.error) {
                setErrorMessageDesc(e.response.data.error);
            } else {
                setErrorMessageDesc("Er is een fout opgetreden bij het importeren van de gegevens vanuit de spreadsheet!");
            }
            setErrorMessageHidden(false);
        });
    }


    return (<>
        <form onSubmit={onSubmit}>
            <input type="file" name="file" accept=".xlsx" onChange={(e) => {setSelectedFile(e.target.files?.[0])}} />
            <br />
            <br />
            <input type="submit" value="Upload"/>
        </form>

        <ErrorMessage title={errorMessageTitle} desc={errorMessageDesc} hidden={errorMessageHidden} setHiddenCallback={setErrorMessageHidden} />
        <SuccessMessage title={successMessageTitle} desc={successMessageDesc} hidden={successMessageHidden} setHiddenCallback={setSuccessMessageHidden} />
    </>)
}