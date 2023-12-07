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
  const [percentageMode, setPercentageMode] = useState<boolean>(false);
  const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);


  

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
      console.log(e.data);
      //throw e;
    });
  }, []);


  function processResults(testIndex: number = selectedTestIndex, results: TestResult[] = testResults, usePercentages: boolean = percentageMode) {
    setSelectedTestIndex(testIndex);
    const domainNames = ["Stoffen en materialen", "Reacties",
    "Industrie en analyse", "Rekenen", "Chemie van het leven", "Energie en duurzaamheid"];
    const questionTypes = ["Formule", "Berekening", "Leg Uit"];
    const questionDimensions = ["Reproductie", "Toepassing", "Inzicht"];

    let tests: TestResult[];
    if (testIndex == -1) {
      tests = results;
    } else {
      tests = [results[testIndex]];
    }

    let totalPointsPerDomain = [] as number[][];
    let pointsGainedPerDomain = [] as number[][];
    let percentagesPerDomain = [] as number[][];

    let totalPointsPerQuestionType = [] as number[][];
    let pointsGainedPerQuestionType = [] as number[][];
    let percentagesPerQuestionType = [] as number[][];

    let totalPointsPerQuestionDimension = [] as number[][];
    let pointsGainedPerQuestionDimension = [] as number[][];
    let percentagesPerQuestionDimension = [] as number[][];
    

    for (let i = 0; i < tests.length; i++) {

      totalPointsPerDomain[i] = [0, 0, 0, 0, 0, 0];
      pointsGainedPerDomain[i] = [0, 0, 0, 0, 0, 0];
      percentagesPerDomain[i] = [0, 0, 0, 0, 0, 0];

      totalPointsPerQuestionType[i] = [0, 0, 0];
      pointsGainedPerQuestionType[i] = [0, 0, 0];
      percentagesPerQuestionType[i] = [0, 0, 0];

      totalPointsPerQuestionDimension[i] = [0, 0, 0];
      pointsGainedPerQuestionDimension[i] = [0, 0, 0];
      percentagesPerQuestionDimension[i] = [0, 0, 0];

      const questions = tests[i].questions;

      for (let j = 0; j < questions.length; j++) {
        totalPointsPerDomain[i][questions[j].domain] += questions[j].totalPoints;
        pointsGainedPerDomain[i][questions[j].domain] += questions[j].pointsGained;
        percentagesPerDomain[i][questions[j].domain] = pointsGainedPerDomain[i][questions[j].domain] / totalPointsPerDomain[i][questions[j].domain] * 100;
  
        totalPointsPerQuestionType[i][questions[j].questionType] += questions[j].totalPoints;
        pointsGainedPerQuestionType[i][questions[j].questionType] += questions[j].pointsGained;
        percentagesPerQuestionType[i][questions[j].questionType] = pointsGainedPerQuestionType[i][questions[j].questionType] / totalPointsPerQuestionType[i][questions[j].questionType] * 100;
  
        totalPointsPerQuestionDimension[i][questions[j].dimension] += questions[j].totalPoints;
        pointsGainedPerQuestionDimension[i][questions[j].dimension] += questions[j].pointsGained;
        percentagesPerQuestionDimension[i][questions[j].dimension] = pointsGainedPerQuestionDimension[i][questions[j].dimension] / totalPointsPerQuestionDimension[i][questions[j].dimension] * 100;
      }
    }
    
    
    let domainPercentagesDatassets = [];
    let domainTotalPointsDatasets = [];


    for (let i = 0; i < tests.length; i++) {
      domainTotalPointsDatasets.push(...[
        {
          label: `Totaal aantal punten voor ${tests[i].name}`,
          data: totalPointsPerDomain[i],
          backgroundColor: [
            'rgb(153, 102, 255)'
          ],
          borderColor: [
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        },
        {
          label: `Behaalde punten voor ${tests[i].name}`,
          data: pointsGainedPerDomain[i],
          backgroundColor: [
            'rgb(255, 99, 132)'
          ],
          borderColor: [
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }
      ]);

      domainPercentagesDatassets.push({
        label: `% Behaalde punten voor ${tests[i].name}`,
        data: percentagesPerDomain[i],
        backgroundColor: [
          'rgb(153, 102, 255)'
        ],
        borderColor: [
          'rgb(153, 102, 255)'
        ],

      })
    }



    let domainBarChartData = {
      labels: domainNames,
      datasets: !usePercentages ? domainTotalPointsDatasets : domainPercentagesDatassets
    };


    setDomainBarChart(domainBarChartData);

    
    let questionTotalPointsDatasets = [];
    let questionPercentagesDatasets = [];


    for (let i = 0; i < tests.length; i++) {
      questionTotalPointsDatasets.push(...[
        {
          label: `Totaal aantal punten voor ${tests[i].name}`,
          data: totalPointsPerQuestionType[i],
          backgroundColor: [
            'rgb(153, 102, 255)'
          ],
          borderColor: [
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        },
        {
          label: `Behaalde punten voor ${tests[i].name}`,
          data: pointsGainedPerQuestionType[i],
          backgroundColor: [
            'rgb(255, 99, 132)'
          ],
          borderColor: [
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }
      ]);

      questionPercentagesDatasets.push({
        label: `% Behaalde punten voor ${tests[i].name}`,
        data: percentagesPerQuestionType[i],
        backgroundColor: [
          'rgb(153, 102, 255)'
        ],
        borderColor: [
          'rgb(153, 102, 255)'
        ],

      })
    }

    let questionTypeBarChartData ={
      labels: questionTypes,
      datasets: !usePercentages ? questionTotalPointsDatasets : questionPercentagesDatasets
    }


    setQuestionTypeBarChart(questionTypeBarChartData);


    let questionDimensionTotalPointsDatasets = [];
    let questionDimensionPercentagesDatasets = [];


    for (let i = 0; i < tests.length; i++) {
      questionDimensionTotalPointsDatasets.push(...[
        {
          label: `Totaal aantal punten voor ${tests[i].name}`,
          data: totalPointsPerQuestionDimension[i],
          backgroundColor: [
            'rgb(153, 102, 255)'
          ],
          borderColor: [
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        },
        {
          label: `Behaalde punten voor ${tests[i].name}`,
          data: pointsGainedPerQuestionDimension[i],
          backgroundColor: [
            'rgb(255, 99, 132)'
          ],
          borderColor: [
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }
      ]);

      questionDimensionPercentagesDatasets.push({
        label: `% Behaalde punten voor ${tests[i].name}`,
        data: percentagesPerQuestionDimension[i],
        backgroundColor: [
          'rgb(153, 102, 255)'
        ],
        borderColor: [
          'rgb(153, 102, 255)'
        ],

      })
    }


    let questionDimensionBarChartData = {
      labels: questionDimensions,
      datasets: !usePercentages ? questionDimensionTotalPointsDatasets : questionDimensionPercentagesDatasets
    }


    setQuestionDimensionBarChart(questionDimensionBarChartData);
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
                <div className="bg-white rounded-lg w-4/6 h-40 ml-10 p-5 m-5">
                  <p>Kies hier de toets die je wilt bekijken:</p>
                  <br />
                  {/* Toets selectie menu */}
                  <form>
                    <select onChange={e => processResults(parseInt(e.target.value))}>
                      <option value="-1" key="1">Alle toetsen</option>
                      {selectTestOptions ? selectTestOptions.map((e) => {return e}) : ""}
                    </select>
                  </form>

                  {/* Punten of percentages selectie menu */}
                  <form>
                    <select onChange={e => {setPercentageMode(e.target.value === "true"); processResults(undefined, undefined, e.target.value === "true")}}>
                      <option value="false" key="1">Punten</option>
                      <option value="true" key="2">Percentages</option>
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
                    <div className="bg-white p-8 h-92 w-256 m-0 ml-0 mr-16 my-4">
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
