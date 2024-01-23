"use client"

import CheckLogin from "@/components/checkLogin"
import LogoutButton from "@/components/logoutButton"
import { ReactElement, useEffect, useState, useRef, MutableRefObject } from "react"
import axios from "axios";
import User from "@/interfaces/user";
import { TestResult } from "@/interfaces/testResult";
import SelectSearch, { SelectSearchOption } from "react-select-search";
import QuestionDomain from "@/enums/Test/questionDomain";
import { Bar, getDatasetAtEvent } from "react-chartjs-2";
import 'react-select-search/style.css';
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

export default function MainPage() {
  const colorOrder = ["#ff6687", "#ffce5d", "#4ed9d9", "#37afff"];


  const percentageModeOptionsDefault = [<option value="false" key="1">Punten</option>, <option value="true" key="2">Percentages</option>];


  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [domainBarChart, setDomainBarChart] = useState<ChartData<"bar"> | null>(null);
  const [questionTypeBarChart, setQuestionTypeBarChart] = useState<ChartData<"bar"> | null>(null);
  const [questionDimensionBarChart, setQuestionDimensionBarChart] = useState<ChartData<"bar"> | null>(null);
  const [selectTestOptions, setSelectTestOptions] = useState<ReactElement[] | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [percentageMode, setPercentageMode] = useState<boolean>(false);
  const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);
  const [percentageModeOptions, setPercentageModeOptions] = useState<ReactElement[]>(percentageModeOptionsDefault);

  const [selectUserOptions, setSelectUserOptions] = useState<SelectSearchOption[] | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const chartRefs: {[key: string]: MutableRefObject<ChartJS<"bar"> | null>} = {
    domain: useRef<ChartJS<"bar"> | null>(null),
    questionType: useRef<ChartJS<"bar"> | null>(null),
    dimension: useRef<ChartJS<"bar"> | null>(null)
  }


  


  useEffect(() => {
    fetchTestResults();
  }, []);


  function fetchTestResults(userId?: string) {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/testResults`;
    if (userId) {
      url += "?user=" + userId;
    }
    axios.get(url, {withCredentials: true}).then((response) => {
      console.log(response.data);
      
      for (let i = 0; i < response.data.length; i++) {
        const test = response.data[i] as TestResult;
      }
      setTestResults(response.data as TestResult[]);

      generateTestOptions(response.data as TestResult[]);

      // we pass it here as argument anyways because state is not immediatly updated (only on next render)
      processResults(-1, response.data as TestResult[]);

    }).catch((e) => {
      console.log(e.data);
      //throw e;
    });
  }


  function generateTestOptions(results: TestResult[], selectedIndex: number =-1) {
    let options: ReactElement[] = [];
    options.push(<option value="-1" key="1" selected={selectedIndex === -1}>Alle toetsen</option>);
    for (let i = 0; i < results.length; i++) {
      const test = results[i];
      options.push(<option value={i} key={test._id} selected={selectedIndex == i}>{test.name}</option>);
    }
    setSelectTestOptions(options);
  }


  function processResults(testIndex: number = selectedTestIndex, results: TestResult[] = testResults, usePercentages: boolean = percentageMode, color?: string) {
    setSelectedTestIndex(testIndex);

    

    const domainNames = ["Stoffen en materialen", "Reacties",
    "Industrie en analyse", "Rekenen", "Chemie van het leven", "Energie en duurzaamheid"];
    const questionTypes = ["Formule", "Berekening", "Leg Uit"];
    const questionDimensions = ["Reproductie", "Toepassing", "Inzicht"];

    let tests: TestResult[];
    if (testIndex == -1) {
      tests = results;

      setPercentageModeOptions([percentageModeOptionsDefault[1]]);
      usePercentages = true;
      setPercentageMode(true);
    } else {
      tests = [results[testIndex]];
      setPercentageModeOptions(percentageModeOptionsDefault);
    }

    generateTestOptions(results, testIndex);


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
        },
        {
          label: `Behaalde punten voor ${tests[i].name}`,
          data: pointsGainedPerDomain[i],
          backgroundColor: [
              color ? color : colorOrder[testIndex % colorOrder.length]
          ]
        }
      ]);

      domainPercentagesDatassets.push({
        label: `% Behaalde punten voor ${tests[i].name}`,
        data: percentagesPerDomain[i],
        backgroundColor: [
          color ? color : colorOrder[(testIndex == -1 ? i : testIndex) % colorOrder.length]
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
            color ? color : colorOrder[testIndex % colorOrder.length]
          ]
        }
      ]);

      questionPercentagesDatasets.push({
        label: `% Behaalde punten voor ${tests[i].name}`,
        data: percentagesPerQuestionType[i],
        backgroundColor: [
          color ? color : colorOrder[(testIndex == -1 ? i : testIndex) % colorOrder.length]
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
              color ? color : colorOrder[testIndex % colorOrder.length]
          ]
        }
      ]);

      questionDimensionPercentagesDatasets.push({
        label: `% Behaalde punten voor ${tests[i].name}`,
        data: percentagesPerQuestionDimension[i],
        backgroundColor: [
          color ? color : colorOrder[(testIndex == -1 ? i : testIndex) % colorOrder.length]
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

    if (user.isAdmin) {
      setIsAdmin(true);
      // fill select user options
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {withCredentials: true}).then((response) => {
        console.log(response.data);
        let options: SelectSearchOption[] = [];
        for (let i = 0; i < response.data.length; i++) {
          const user = response.data[i] as User;
          options.push({name: user.firstName + " " + user.lastName, value: user._id});
        }
        setSelectUserOptions(options);
      }).catch((e) => {
        console.log(e.data);
        //throw e;
      });
    }
  }



  function domainChartClicked(e: any) {
    barChartClicked(e, "domain");
  }

  function questionTypeChartClicked(e: any) {
    barChartClicked(e, "questionType");
  }

  function dimensionChartClicked(e: any) {
    barChartClicked(e, "dimension");
  }


  function barChartClicked(e: any, refKey: string) {
    const chart = chartRefs[refKey].current;


    if (chart) {
      const bars = chart.getElementsAtEventForMode(e, "nearest", {intersect: true}, true);
      if (bars.length == 0) {
        return;
      }
      const bar = bars[0];
      const label = chart.data.datasets[bar.datasetIndex].label;
      if (label) {
        for (let i = 0; i < testResults.length; i++) {
          if (label.includes(testResults[i].name)) {
            const color = chart.data.datasets[bar.datasetIndex].backgroundColor;
            if (selectedTestIndex == -1) {
              // this is so cursed but typescript wants me to
              if (color && typeof (color as any)[0] === "string") { 
                processResults(i, testResults, percentageMode, (color as any)[0]);
              } else {
                processResults(i, testResults, percentageMode);
              }
            } else {
              processResults(-1, testResults, percentageMode);
              
            }
          }
        }
      }
    }
  }




    return (
    <div className="">  
        <div className=" bg-slate-200 min-h-full" style={{ backgroundColor: '#e2e8f0' }}>
    <div className="text-slate-500">
      {/* 1e regel */}
      <div className="flex flex-col md:flex-row justify-between m-10">
        <div className="bg-yellow-40 rounded-lg p-7 mb-4 w-full md:w-1/4">
          <b className="text-red-500 text-2xl">Welkom {name}!</b>
          <p className="text-slate-500">Dashboard van {fullName}</p>
        </div>
      
        <div className="bg-white rounded-lg p-5 mb-4 w-full md:w-1/6">
          <p className="text-slate-500 text-left text-lg">Scheikunde</p>
        </div>
      </div>

      {/* 2e regel */}
      <div className="m-10">
        <div className="bg-white rounded-lg p-5 mb-4">
          <p>Kies hier de toets die je wilt bekijken:</p>
          {/* Toets selectie menu */}
          <form>
            <select onChange={e => processResults(parseInt(e.target.value))}>
              {selectTestOptions ? selectTestOptions.map((e) => {return e}) : ""}
            </select>
          </form>

          {/* Punten of percentages selectie menu */}
          <form>
            <select onChange={e => {setPercentageMode(e.target.value === "true"); processResults(undefined, undefined, e.target.value === "true")}}>
              {percentageModeOptions.map((e) => {return e})}
            </select>
          </form>
        </div>
        <div hidden={!isAdmin} className="mb-4">
          {selectUserOptions ? <SelectSearch options={selectUserOptions} search={true} placeholder="Zoek een leerling..." /> : null}
        </div>
      </div>

      {/* Grafieken */}
      <div className="m-10">
        <div className="bg-white p-8 mb-4">
          <p className="text-slate-500">Diagram 1</p>
          {domainBarChart ? <Bar ref={chartRefs.domain} data={domainBarChart} onClick={domainChartClicked} /> : <p>Geen data</p>}
        </div>

        <div className="bg-white p-8 mb-4">
          <p className="text-slate-500">Diagram 2</p>
          {questionTypeBarChart ? <Bar ref={chartRefs.questionType} data={questionTypeBarChart} onClick={questionTypeChartClicked} /> : <p>Geen data</p>}
        </div>

        <div className="bg-white p-8 mb-4">
          <p className="text-slate-500">Diagram 3</p>
          {questionDimensionBarChart ? <Bar ref={chartRefs.dimension} data={questionDimensionBarChart} onClick={dimensionChartClicked} /> : <p>Geen data</p>}
        </div>
      </div>

      <CheckLogin onSuccess={onUserFetched} />
      <LogoutButton />
    </div>
  </div>

  </div>


      )
    }
