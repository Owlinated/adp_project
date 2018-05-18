import { IRestEquation } from "../interface/IRestEquation";

export function formatEquation(equation: IRestEquation, references: IRestEquation[]): string {
    let result = equation.equation;

    // Substitute default operations
    result = result
        .replace(/\//g, "÷")
        .replace(/\*/gi, "×")
        .replace(/\//gi, "÷")
        .replace(/Sin\(/gi, "sin(")
        .replace(/Cos\(/gi, "cos(");

    // Fix spacing around operators
    result = result
        .replace(/\s*([×÷\+\-])\s*/g, " $1 ");

    // Substitute used variables
    result = equation.parameters.reduce((acc, parameter, index) => {
            const regex = new RegExp(`Var\\(${index}\\)`, "gi");
            return acc.replace(regex, parameter.name);
        },
        result);

    // Substitute referenced equations
    result = references.reduce((acc, reference) => {
            const regex = new RegExp(`Ref\\(${reference.id}\\)`, "gi");
            const parameters = reference.parameters.map((parameter) => parameter.name);
            return acc.replace(regex, `${reference.description}(${parameters.join(", ")})`);
        },
        result);

    return result;
}
