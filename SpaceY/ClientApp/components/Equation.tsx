import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IRestEquation } from "../interface/IRestEquation";
import { IRestEquationParam } from "../interface/IRestEquationParam";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";

interface IEquationState {
    loading: boolean;
    equation: IRestNestedEquation | undefined;
    result: number | undefined;
    parameters: { [equationId: number]: { [parameterId: number]: number } };
}

/**
 * Component for a detailed equation view.
 * This enables most interactions, such as evaluating equations.
 */
export class Equation extends React.Component<RouteComponentProps<any>, IEquationState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { loading: true, equation: undefined, result: undefined, parameters: {} };
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
        if (JSON.stringify(prevState.parameters) !== JSON.stringify(this.state.parameters) ||
            prevState.equation !== this.state.equation) {
            this.evaluateEquation();
        }
    }

    /**
     * Fetch the current equation from the server.
     */
    fetchEquation() {
        this.setState({ loading: true, result: undefined });
        fetch(`api/Equations/${this.props.match.params.id}`)
            .then(response => response.json() as Promise<IRestNestedEquation>)
            .then(data => {
                this.setState({ equation: data, loading: false });
                this.evaluateEquation();
            });
    }

    /**
     *  Display the equation and all interaction elements.
     */
    render() {
        if (this.state.loading) {
            return <div>
                <p>Loading..</p>
            </div>;
        }

        const equation = this.state.equation as IRestNestedEquation;
        return <div>
            {this.renderReferences(equation.references)}
            {this.renderEquation(equation.main)}
        </div>;
    }

    /**
     * Render a list of referenced equations if it is non empty.
     * @param references The list of referenced equations to render.
     */
    renderReferences(references: IRestEquation[]) {
        if (!(references.length > 0)) {
            return null;
        }

        return <div>
            <h2>References</h2>
            {references.map(reference => this.renderReference(reference))}
        </div>;
    }

    /**
     * Render a single referenced equation.
     * @param reference The equation to render.
     */
    renderReference(reference: IRestEquation) {
        return <div className="panel-group">
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
                        {this.renderEquation(reference)}
                    </div>
                </div>
            </div>
        </div>;
    }

    /**
     * Render the equation. Right now this simply displays it as text.
     * @param equation The equation to render
     */
    renderEquation(equation: IRestEquation) {
        const isMain = equation === (this.state.equation as any).main;
        return <div>
                   <p>{isMain ? `${equation.equation} = ${this.state.result}` : equation.equation}</p>
                   {equation.parameters.map((parameter, index) => this.renderParameter(equation, parameter, index))}
               </div>;
    }

    /**
     * Render a single parameter.
     * @param equation Equation the parameter is assigned to.
     * @param parameter The parameter to render.
     * @param index The parameters index within the equation.
     */
    renderParameter(equation: IRestEquation, parameter: IRestEquationParam, index: number) {
        return <div className="input-group">
                   <span className="input-group-addon">{parameter.description} ({parameter.name})</span>
                   <input type="number" className="form-control" placeholder={`${parameter.default}`}
                          onChange={(value: React.ChangeEvent<HTMLInputElement>) => this.updateParam(equation, index, value)}/>
               </div>;
    }

    /**
     * Update the state with a new paramter value.
     * @param equation Equation parameter is part of.
     * @param index Index of the parameter within the equation.
     * @param value New value of the parameter.
     */
    updateParam(equation: IRestEquation, index: number, value: React.ChangeEvent<HTMLInputElement>) {
        const newValue = Number(value.target.value);
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
    evaluateEquation() {
        /*
        fetch(`api/Equations/${this.props.match.params.id}/Evaluate`)
            .then(response => response.json() as Promise<number>)
            .then(data => {
                this.setState({ result: data });
            });
            */

        fetch(`api/Equations/${this.props.match.params.id}/Evaluate`,
                {
                    method: "POST",
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(this.state.parameters)
                })
            // Interpret answer as result, and update state
            .then(response => response.json() as Promise<number>)
            .then(data => {
                this.setState({ result: data });
            });
    }
}
