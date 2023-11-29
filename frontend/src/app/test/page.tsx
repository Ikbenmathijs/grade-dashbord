"use client"

import CheckLogin from "@/components/checkLogin"
import LogoutButton from "@/components/logoutButton"
import { useEffect, useState } from "react"
import axios from "axios";
import User from "@/interfaces/user";
import { TestResult } from "@/interfaces/testResult";
import QuestionDomain from "@/enums/Test/questionDomain";
import { Bar } from "react-chartjs-2";
import { ChartData,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend } from "chart.js";




ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TestPage() {

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [domainBarChart, setDomainBarChart] = useState<ChartData<"bar"> | null>(null);
  

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/testResults`, {withCredentials: true}).then((response) => {
      setText(response.data);
      console.log(response.data);
      processResults(response.data as TestResult[]);
    }).catch((e) => {
      setText("Error: " + e.data);
      //throw e;
    });
  }, []);


  function processResults(results: TestResult[]) {
    
    const domainNames = ["Stoffen en materialen", "Reacties",
    "Industrie en analyse", "Rekenen", "Chemie van het leven", "Energie en duurzaamheid"];

    const test = results[0];
    const questions = test.questions;

    let totalPointsPerDomain = [0, 0, 0, 0, 0, 0];
    let pointsGainedPerDomain = [0, 0, 0, 0, 0, 0];
    
    for (let j = 0; j < questions.length; j++) {
      totalPointsPerDomain[questions[j].domain] += questions[j].totalPoints;
      pointsGainedPerDomain[questions[j].domain] += questions[j].pointsGained;
    }

    setDomainBarChart({
      labels: domainNames,
      datasets: [
        {
          label: "Totaal aantal punten",
          data: totalPointsPerDomain,
          backgroundColor: [
            'rgb(153, 102, 255)'
          ],
          borderColor: [
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        },
        {
          label: "Behaalde punten",
          data: pointsGainedPerDomain,
          backgroundColor: [
            'rgb(255, 99, 132)'
          ],
          borderColor: [
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }
      ]
    });
  }





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
        <div className="flex flex-col h-screen">
        {/* 1e regel */}
          <div className="flex justify-between">
            <div className="bg-white rounded-lg p-7 w-1/4 m-10 mb-2">
              <b className="text-slate-700 text-2xl">Welkom {name}!</b>
              <p className="text-slate-500">Dashboard van {fullName}</p>
            </div>
          
            <div className="bg-white rounded-lg p-5 w-1/6 h-16 m-10 mb-6 flex-row-reverse">
              <p className="text-slate-500 text-right text-lg">Scheikunde</p>
            </div>
          </div>

        {/* 2e regel */}
          <div className="flex justify-between">
            <div className="bg-white rounded-lg p-5 w-1/5 h-24 m-10 mb-2">
              <p className="text-slate-500">Je hebt nog ... dagen tot de volgende toets.</p>
            </div>

            <div className="bg-white p-7 w-1/3 h-56 m-10 mt-2">
              <p className="text-slate-500">Diagram 1</p>
              {domainBarChart ? <Bar data={domainBarChart} /> : <p>Geen data</p>}

            </div>
          </div>
            
          {/* 3e regel*/}  
          <div className="flex justify-between">
            <div className="bg-white rounded-lg p-5 w-1/5 h-50 m-10 mt-2">
              <p className="text-slate-500">De volgende hoofdstukken en dimensies:</p>
            </div>

            <div className="bg-white p-7 w-1/3 h-56 m-10 mt-2">
              <p className="text-slate-500">Diagram 2</p>
            </div>
          </div> 
          
          {/* 4e regel*/}  
          <div className="flex justify-between">
            <div className="bg-white rounded-lg p-5 w-1/2 h-60 m-10 mt-2">
              <p className="text-slate-500">Resultaten in percentages</p>
            </div>

            <div className="bg-white p-7 w-1/3 h-56 m-10 mt-2">
              <p className="text-slate-500">Diagram 3</p>
            </div>
          </div> 

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