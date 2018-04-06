import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IRestEquation } from "../types/IRestEquation";

interface IEquationState {
    id: number;
    loading: boolean;
    equation: IRestEquation | undefined;
    result: number | undefined;
}

export class Equation extends React.Component<RouteComponentProps<any>, IEquationState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { id: props.match.params.id, loading: true, equation: undefined, result: undefined };

        fetch("api/Equations/" + this.state.id)
            .then(response => response.json() as Promise<IRestEquation>)
            .then(data => {
                this.setState({ equation: data, loading: false });
            });
    }

    render() {
        return <div>
                   <h1>Equation</h1>
            <p>Id: {this.state.id} </p>
            {this.state.loading ? <p>loading</p> : Equation.renderEquation(this.state.equation!)}
            <button onClick={() => { this.evaluateEquation() }}>Evaluate</button>
            <p>{this.state.result}</p>
            </div>;
    }

    private static renderEquation(equation: IRestEquation) {
        return <p>{equation.equation}</p>;
    }

    private evaluateEquation() {
        fetch("api/Equations/Evaluate/" + this.state.id)
            .then(response => response.json() as Promise<number>)
            .then(data => {
                this.setState({ result: data });
            });
    }
}