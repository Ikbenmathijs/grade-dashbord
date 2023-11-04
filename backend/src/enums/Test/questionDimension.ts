const enum Dimension {
    Reproductie, // Reproductie
    Toepassing, // Toepassing
    Inzicht // Inzicht
}


export default Dimension;


export function letterToQuestionDimension(inp: string): Dimension {
    if (inp.toLowerCase() == "r") return Dimension.Reproductie;
    if (inp.toLowerCase() == "t") return Dimension.Toepassing;
    if (inp.toLowerCase() == "r") return Dimension.Inzicht;
    throw new Error(`Vraagdimensie bestaat niet: ${inp}`);
}