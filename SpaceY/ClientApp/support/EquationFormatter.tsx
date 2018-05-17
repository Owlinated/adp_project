import {IRestNestedEquation} from "../interface/IRestNestedEquation"

export function FormatEquation(equation: IRestNestedEquation): string {
    const result = equa.replace(/\//g, "÷")
        .replace(/\*/g, "×")
        .replace(/v/g, "V")
        .replace(/Var\(0\)/g, "X")
        .replace(/Var\(1\)/g, "Y")
        .replace(/Var\(2\)/g, "Z")
        .replace(/Sin\(/g, "s")
        .replace(/Cos\(/g, "c")
        .replace(/Ref\(/g, "e")
        .replace(/ref\(/g, "e")
        .replace(/\s/g, "")
    return "asdf";
}