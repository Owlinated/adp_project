import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IRestEquation } from "../types/IRestEquation";

interface IEquationState {
    id: number | undefined;
    loading: boolean;
    equation: IRestEquation | undefined;
    result: number | undefined;
}

/**
 * Component for a detailed equation view.
 * This enables most interactions, such as evaluating equations.
 */
export class Equation extends React.Component<RouteComponentProps<any>, IEquationState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { id: undefined, loading: true, equation: undefined, result: undefined };
    }

    /**
     * Update the displayed equation when its id changes.
     * This can be necessary, when switching between equations.
     */
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

    /**
     *  Display the equation and all interaction elements.
     */
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

    /**
     * Render the equation. Right now this simply displays it as text.
     * @param equation The equation to render
     */
    renderEquation(equation: IRestEquation) {
        return <p>{equation.equation}</p>;
    }

    /**
     * Ask server to evaluate the equation and add the values to the state.
     */
    evaluateEquation() {
        fetch(`api/Equations/${this.state.id}/Evaluate`)
            .then(response => response.json() as Promise<number>)
            .then(data => {
                this.setState({ result: data });
            });
    }
}