"use client"

import CheckLogin from "@/components/checkLogin"
import LogoutButton from "@/components/logoutButton"
import { ReactElement, useEffect, useState } from "react"
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

  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [domainBarChart, setDomainBarChart] = useState<ChartData<"bar"> | null>(null);
  const [questionTypeBarChart, setQuestionTypeBarChart] = useState<ChartData<"bar"> | null>(null);
  const [questionDimensionBarChart, setQuestionDimensionBarChart] = useState<ChartData<"bar"> | null>(null);
  const [selectTestOptions, setSelectTestOptions] = useState<ReactElement[] | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/testResults`, {withCredentials: true}).then((response) => {
      console.log(response.data);

      
      let options: ReactElement[] = [];
      for (let i = 0; i < response.data.length; i++) {
        const test = response.data[i] as TestResult;
        options.push(<option value={i} key={test._id}>{test.name}</option>);
      }
      setTestResults(response.data as TestResult[]);

      // we pass it here as argument anyways because state is not immediatly updated (only on next render)
      processResults(0, response.data as TestResult[]);


      setSelectTestOptions(options);
      

      
    }).catch((e) => {
      console.log(e);
      //throw e;
    });
  }, []);


  function processResults(testIndex: number = 0, results: TestResult[] = testResults) {
    console.log("BAR CHART CHANGE AAA")
    const domainNames = ["Stoffen en materialen", "Reacties",
    "Industrie en analyse", "Rekenen", "Chemie van het leven", "Energie en duurzaamheid"];
    const questionTypes = ["Formule", "Berekening", "Leg Uit"];
    const questionDimensions = ["Reproductie", "Toepassing", "Inzicht"];
    const test = results[testIndex];
    const questions = test.questions;

    let totalPointsPerDomain = [0, 0, 0, 0, 0, 0];
    let pointsGainedPerDomain = [0, 0, 0, 0, 0, 0];

    let totalPointsPerQuestionType = [0, 0, 0];
    let pointsGainedPerQuestionType = [0, 0, 0];

    let totalPointsPerQuestionDimension = [0, 0, 0];
    let pointsGainedPerQuestionDimension = [0, 0, 0];
    
    for (let j = 0; j < questions.length; j++) {
      totalPointsPerDomain[questions[j].domain] += questions[j].totalPoints;
      pointsGainedPerDomain[questions[j].domain] += questions[j].pointsGained;

      totalPointsPerQuestionType[questions[j].questionType] += questions[j].totalPoints;
      pointsGainedPerQuestionType[questions[j].questionType] += questions[j].pointsGained;

      totalPointsPerQuestionDimension[questions[j].dimension] += questions[j].totalPoints;
      pointsGainedPerQuestionDimension[questions[j].dimension] += questions[j].pointsGained;
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


    setQuestionTypeBarChart({
      labels: questionTypes,
      datasets: [
        {
          label: "Totaal aantal punten",
          data: totalPointsPerQuestionType,
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
          data: pointsGainedPerQuestionType,
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


    setQuestionDimensionBarChart({
      labels: questionDimensions,
      datasets: [
        {
          label: "Totaal aantal punten",
          data: totalPointsPerQuestionDimension,
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
          data: pointsGainedPerQuestionDimension,
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
        <div className="flex flex-col h-128 bg-slate-200 text-slate-500">
        {/* 1e regel */}
          <div className="flex justify-between">
            <div className="bg-white rounded-lg p-7 w-1/4 m-10 mb-2">
              <b className="text-slate-700 text-2xl">Welkom {name}!</b>
              <p className="text-slate-500">Dashboard van {fullName}</p>
            </div>
          
            <div className="bg-white rounded-lg p-5 w-1/6 h-16 m-10 mb-2 flex-row-reverse">
              <p className="text-slate-500 text-right text-lg">Scheikunde</p>
            </div>
          </div>

          {/* 2e regel */}          
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div className="bg-white rounded-lg w-4/6 h-32 ml-10 p-5 m-5">
                  <p>Kies hier de toets die je wilt bekijken:</p>
                  <br />
                  <form>
                    <select onChange={(e) => {console.log("change event owo");
                      processResults(parseInt(e.target.value))}}>
                      {selectTestOptions ? selectTestOptions.map((e) => {return e}) : ""}
                    </select>
                  </form>
                </div>
                <div className="bg-white rounded-lg p-5 w-4/6 h-24 m-5 ml-10 mr-0">
                  <p className="text-slate-500">Je hebt nog ... dagen tot de volgende toets.</p>
                </div>

                <div className="bg-white rounded-lg p-5 w-4/6 h-72 m-5 ml-10 mr-0">
                  <p className="text-slate-500">
                    <b>De volgende hoofdstukken en dimensies:</b>
                    <br /> 
                    <i>Bijvoorbeeld</i>
                  <br />
                  - Hoofdstuk 8
                  <br />
                  - Hoofdstuk 9
                  <br />
                  - Hoofdstuk 10
                  </p>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col justify-items-start">
                    <div className="bg-white p-12 h-92 w-256 m-0 ml-0 mr-16 my-5">
                      <p className="text-slate-500 mr-96">Diagram 1</p>
                      {domainBarChart ? <Bar data={domainBarChart} /> : <p>Geen data</p>}
                    </div>

                    <div className="flex justify-start items-end">
                      <div className="bg-white rounded-lg p-5 h-64 w-full m-5 ml-0 mr-16">
                        <p className="text-slate-500">Resultaten in percentages</p>
                      </div>
                    </div> 
                </div>

                <div className="flex flex-col">
                  <div className="bg-white p-8 h-64 w-96 m-5 ml-2 mr-10">
                    <p className="text-slate-500">Diagram 2</p>
                    {questionTypeBarChart ? <Bar data={questionTypeBarChart} /> : <p>Geen data</p>}

                  </div>

                  <div className="bg-white p-8 h-64 w-96 m-5 ml-2 mr-10">
                    <p className="text-slate-500">Diagram 3</p>
                    {questionDimensionBarChart ? <Bar data={questionDimensionBarChart} /> : <p>Geen data</p>}
                  </div>
                </div>
              </div>           
            </div>
          </div>
          
 

        <CheckLogin onSuccess={onUserFetched} />

        <div>
          <LogoutButton />
        </div>
        

        </div>
      </div>
    )
  }