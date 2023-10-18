import LogLevel from "./enums/logLevel";

// Nicely formatted logging 
export default function log(level: LogLevel, text: string) {
    const date = new Date();
    const dateStr = date.toISOString();
    const levelStr = level.toString();
    console.log(`${dateStr} [${levelStr}] ${text}`);
    
}