import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IRestEquation } from "../interface/IRestEquation";

interface IEquationState {
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
        this.state = { loading: true, equation: undefined, result: undefined };
        this.fetchEquation();
    }

    /**
     * Update the displayed equation when its id changes.
     * This can be necessary, when switching between equations.
     */
    componentDidUpdate(prevProps: RouteComponentProps<any>, prevState: IEquationState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.fetchEquation();
        }
    }

    /**
     * Fetch the current equation from the server.
     */
    fetchEquation() {
        this.setState({ loading: true, result: undefined });
        fetch(`api/Equations/${this.props.match.params.id}`)
            .then(response => response.json() as Promise<IRestEquation>)
            .then(data => {
                this.setState({ equation: data, loading: false });
            });
    }

    /**
     *  Display the equation and all interaction elements.
     */
    render() {
        return <div>
            <h1>Equation</h1>
            <p>Id: {this.props.match.params.id} </p>
            {this.state.loading ? <p>loading</p> : this.renderEquation(this.state.equation!)}
            <button onClick={() => { this.evaluateEquation() }}>Evaluate</button>
            <div>
                <input type="text" readOnly value={this.state.result} />
            </div>
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
        fetch(`api/Equations/${this.props.match.params.id}/Evaluate`)
            .then(response => response.json() as Promise<number>)
            .then(data => {
                this.setState({ result: data });
            });
    }
}
