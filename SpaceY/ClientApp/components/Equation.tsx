import * as React from "react";
import { IRestEquation } from "../interface/IRestEquation";
import { IRestEquationParam } from "../interface/IRestEquationParam";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";

interface IEquationState {
    result: number | undefined;
    parameters: { [equationId: number]: { [parameterId: number]: number | undefined } };
}

/**
 * Component for a detailed equation view.
 * This enables most interactions, such as evaluating equations.
 */
export class Equation extends React.Component<IRestNestedEquation, IEquationState> {
    constructor(props: IRestNestedEquation) {
        super(props);
        this.state = { result: undefined, parameters: {} };
        this.evaluateEquation();
    }

    /**
     * Update the displayed equation when its id changes.
     * This can be necessary, when switching between equations.
     */
    public componentDidUpdate(prevProps: IRestNestedEquation, prevState: IEquationState) {
        if (JSON.stringify(prevState.parameters) !== JSON.stringify(this.state.parameters) ||
            prevProps.main.equation !== this.props.main.equation) {
            this.evaluateEquation();
        }
    }

    /**
     *  Display the equation and all interaction elements.
     */
    public render() {
        return (
            <div>
                {this.renderReferences()}
                {this.renderEquation(this.props.main, true)}
            </div>
        );
    }

    /**
     * Render a list of referenced equations if it is non empty.
     */
    public renderReferences() {
        if (!(this.props.references.length > 0)) {
            return null;
        }

        return (
            <div>
            <h2>References</h2>
            {this.props.references.map((reference) => this.renderReference(reference))}
            </div>
        );
    }

    /**
     * Render a single referenced equation.
     * @param reference The equation to render.
     */
    public renderReference(reference: IRestEquation) {
        return (
            <div className="panel-group">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <a data-toggle="collapse" href={`#collapse${reference.id}`}>
                                {reference.equation}
                            </a>
                        </h4>
                    </div>
                    <div id={`collapse${reference.id}`} className="panel-collapse collapse">
                        <div className="panel-body">
                            {this.renderEquation(reference, false)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Render the equation. Right now this simply displays it as text.
     * @param equation The equation to render
     */
    public renderEquation(equation: IRestEquation, isMain: boolean) {
        return (
            <div>
                <p className="eqresult">{isMain ? `${equation.equation} = ${this.state.result}` : equation.equation}</p>
                {equation.parameters.map((parameter, index) => this.renderParameter(equation, parameter, index))}
            </div>
        );
    }

    /**
     * Render a single parameter.
     * @param equation Equation the parameter is assigned to.
     * @param parameter The parameter to render.
     * @param index The parameters index within the equation.
     */
    public renderParameter(equation: IRestEquation, parameter: IRestEquationParam, index: number) {
        return (
            <div className="input-group">
                <span className="input-group-addon">{parameter.description} ({parameter.name})</span>
                <input
                    type="number"
                    className="form-control"
                    placeholder={`${parameter.standard}`}
                    onChange={(value: React.ChangeEvent<HTMLInputElement>) => this.updateParam(equation, index, value)}
                />
            </div>
        );
    }

    /**
     * Update the state with a new paramter value.
     * @param equation Equation parameter is part of.
     * @param index Index of the parameter within the equation.
     * @param value New value of the parameter.
     */
    public updateParam(equation: IRestEquation, index: number, value: React.ChangeEvent<HTMLInputElement>) {
        const newValue = value.target.value
            ? Number(value.target.value)
            : undefined;
        this.setState((prevState: IEquationState) => {
            // We are not allowed to change the previous state by reference, so we clone it.
            prevState = JSON.parse(JSON.stringify(prevState));
            if (!prevState.parameters[equation.id]) {
                prevState.parameters[equation.id] = {};
            }
            prevState.parameters[equation.id][index] = newValue;
            return { parameters: prevState.parameters };
        });
    }

    /**
     * Ask server to evaluate the equation and add the values to the state.
     */
    public evaluateEquation() {
        /*
        fetch(`api/Equations/${this.props.match.params.id}/Evaluate`)
            .then(response => response.json() as Promise<number>)
            .then(data => {
                this.setState({ result: data });
            });
            */

        fetch(`api/Equations/${this.props.main.id}/Evaluate`,
            {
                body: JSON.stringify(this.state.parameters),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                })
            // Interpret answer as result, and update state
            .then((response) => response.json() as Promise<number>)
            .then((data) => {
                this.setState({ result: data });
            });
    }
}
