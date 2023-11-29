const enum QuestionType {
    Formule, // Formule / Vergelijking / Schema
    Berekening, // Berekening
    LegUit // Leg uit
}


export default QuestionType;

export function letterToQuestionType(inp: string): QuestionType {
    if (inp.toLowerCase() == "f") return QuestionType.Formule;
    if (inp.toLowerCase() == "b") return QuestionType.Berekening;
    if (inp.toLowerCase() == "l") return QuestionType.LegUit;
    throw new Error(`Vraagtype bestaat niet: ${inp}`);
}