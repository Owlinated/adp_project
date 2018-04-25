import { IRestEquationParam } from "./IRestEquationParam";

export interface IRestEquation {
    id: number;
    equation: string;
    parameters: IRestEquationParam[];
}