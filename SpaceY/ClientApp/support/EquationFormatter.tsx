import { IRestEquation } from "../interface/IRestEquation";

export function formatEquation(equation: IRestEquation, references: IRestEquation[]): string {
    // Substitute default operations
    let result = equation.equation.replace(/\//g, "÷")
        .replace(/\*/g, "×")
        .replace(/\//g, "÷")
        .replace(/Sin\(/g, "sin(")
        .replace(/Cos\(/g, "cos(");

    // Substitute used variables
    result = equation.parameters.reduce((acc, parameter, index) => {
            const regex = new RegExp(`Var\\(${index}\\)`, "g");
            return acc.replace(regex, parameter.name);
        },
        result);

    // Substitute referenced equations
    result = references.reduce((acc, reference) => {
            const regex = new RegExp(`Ref\\(${reference.id}\\)`, "g");
            const parameters = reference.parameters.map((parameter) => parameter.name);
            return acc.replace(regex, `${reference.description}(${parameters.join(", ")})`);
        },
        result);

    return result;
}
