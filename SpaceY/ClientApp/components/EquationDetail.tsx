import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IRestEquation } from "../interface/IRestEquation";
import { IRestEquationParam } from "../interface/IRestEquationParam";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";
import { Equation } from "./Equation";

interface IEquationDetailState {
    loading: boolean;
    equation: IRestNestedEquation | undefined;
}

/**
 * Component for a detailed equation view.
 * This enables most interactions, such as evaluating equations.
 */
export class EquationDetail extends React.Component<RouteComponentProps<any>, IEquationDetailState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { loading: true, equation: undefined};
        this.fetchEquation();
    }

    /**
     * Update the displayed equation when its id changes.
     * This can be necessary, when switching between equations.
     */
    componentDidUpdate(prevProps: RouteComponentProps<any>, prevState: IEquationDetailState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.fetchEquation();
        }
    }

    /**
     * Fetch the current equation from the server.
     */
    fetchEquation() {
        this.setState({ loading: true });
        fetch(`api/Equations/${this.props.match.params.id}`)
            .then(response => response.json() as Promise<IRestNestedEquation>)
            .then(data => {
                this.setState({ equation: data, loading: false });
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
            <h1>{equation.main.description}</h1>
            <Equation {...equation}/> 
        </div>;
    }
}
