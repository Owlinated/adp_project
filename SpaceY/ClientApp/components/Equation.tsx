import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IRestEquation } from "../types/IRestEquation";

interface IEquationState {
    id: number | undefined;
    loading: boolean;
    equation: IRestEquation | undefined;
    result: number | undefined;
}

export class Equation extends React.Component<RouteComponentProps<any>, IEquationState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { id: undefined, loading: true, equation: undefined, result: undefined };
    }

    updateState() {
        if (this.state.id != this.props.match.params.id) {
            this.setState({ id: this.props.match.params.id, loading: true, result: undefined });
            fetch(`api/Equations/${this.state.id}`)
                .then(response => response.json() as Promise<IRestEquation>)
                .then(data => {
                    this.setState({ equation: data, loading: false });
                });
        }
    }

    render() {
        this.updateState();
        return <div>
                   <h1>Equation</h1>
                   <p>Id: {this.state.id} </p>
                   {this.state.loading ? <p>loading</p> : this.renderEquation(this.state.equation!)}
                   <button onClick={() => { this.evaluateEquation() }}>Evaluate</button>
                   <p>{this.state.result}</p>
               </div>;
    }

    renderEquation(equation: IRestEquation) {
        return <p>{equation.equation}</p>;
    }

    evaluateEquation() {
        fetch(`api/Equations/${this.state.id}/Evaluate`)
            .then(response => response.json() as Promise<number>)
            .then(data => {
                this.setState({ result: data });
            });
    }
}