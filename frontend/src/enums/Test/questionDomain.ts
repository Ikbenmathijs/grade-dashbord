
const enum QuestionDomain {
    SM, // Stoffen en materialen
    RC, // Reacties
    IA, // Industrie en analyse
    RK, // Rekenen
    CL, // Chemie van het leven
    ED // Energie en duurzaamheid
}

export default QuestionDomain;


export function stringToQuestionDomain(inp: string): QuestionDomain {
    if (inp.toUpperCase() == "SM") return QuestionDomain.SM;
    if (inp.toUpperCase() == "RC") return QuestionDomain.RC;
    if (inp.toUpperCase() == "IA") return QuestionDomain.IA;
    if (inp.toUpperCase() == "RK") return QuestionDomain.RK;
    if (inp.toUpperCase() == "CL") return QuestionDomain.CL;
    if (inp.toUpperCase() == "ED") return QuestionDomain.ED;
    throw new Error(`Vraagdomein bestaat niet: ${inp}`);
}