import { IRestEquationParam } from "./IRestEquationParam";

export interface IRestEquation {
    id: number;
    description: string;
    equation: string;
    parameters: IRestEquationParam[];
}