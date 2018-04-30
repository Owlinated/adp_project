import { IRestEquation } from "./IRestEquation"

export interface IRestNestedEquation {
    main: IRestEquation;
    references: IRestEquation[];
}