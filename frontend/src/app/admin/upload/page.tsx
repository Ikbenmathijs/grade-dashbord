'use client'
import { useState } from "react";
import axios from "axios";
import ErrorMessage from "@/components/errorMessage";
import SuccessMessage from "@/components/successMessage";
import LoadingIcon from "@/components/loadingIcon";

export default function uploadPage() {

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [errorMessageDesc, setErrorMessageDesc] = useState("");
    const [errorMessageTitle, setErrorMessageTitle] = useState("");
    const [errorMessageHidden, setErrorMessageHidden] = useState(true);
    const [successMessageDesc, setSuccessMessageDesc] = useState("");
    const [successMessageTitle, setSuccessMessageTitle] = useState("");
    const [successMessageHidden, setSuccessMessageHidden] = useState(true);
    const [loading, setLoading] = useState(false);


    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedFile) return;

        console.log(selectedFile);

        let data = new FormData();
        data.append("sheet", selectedFile);

        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sheets/import`, data, {
            withCredentials: true, 
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            setSuccessMessageTitle("Success!");
            setSuccessMessageDesc("De gegevens zijn succesvol geïmporteerd vanuit de spreadsheet!");
            setSuccessMessageHidden(false);
            setLoading(false);
        }).catch((e) => {
            console.log(e.data);
            setErrorMessageTitle("Er is iets mis gegaan!");
            if (e.response?.data?.error) {
                setErrorMessageDesc(e.response.data.error);
            } else {
                setErrorMessageDesc("Er is een fout opgetreden bij het importeren van de gegevens vanuit de spreadsheet!");
            }
            setErrorMessageHidden(false);
            setLoading(false);
        });
    }


    return (<>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="relative w-full h-full">
            <div className="relative bg-white rounded-lg shadow-2xl shadow-slate-700 backdrop-grayscale">
                <div className="p-6 text-center">
                <form onSubmit={onSubmit} className="flex justify-center flex-col items-center">
                    <input className="text-slate-700 mb-10" type="file" name="file" accept=".xlsx" onChange={(e) => {setSelectedFile(e.target.files?.[0])}} />
                    <br />
                    
                    <input hidden={loading} className="text-slate-700 bg-green-400 py-3 px-9 rounded-3xl" type="submit" value="Upload"/>
                </form>
                <div hidden={!loading}>
                    <LoadingIcon />
                </div>

                </div>
            </div>
        </div>
    </div>
        

        <ErrorMessage title={errorMessageTitle} desc={errorMessageDesc} hidden={errorMessageHidden} setHiddenCallback={setErrorMessageHidden} />
        <SuccessMessage title={successMessageTitle} desc={successMessageDesc} hidden={successMessageHidden} setHiddenCallback={setSuccessMessageHidden} />
    </>)
}