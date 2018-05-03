import * as React from "react";
import { RouteComponentProps } from "react-router";
import "isomorphic-fetch";
import { NavLink } from "react-router-dom";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";
import { Equation } from "./Equation";

interface IAllEquations {
    equations: IRestNestedEquation[];
    loading: boolean;
}

/**
 * Component for showing all equations.
 */
export class AllEquations extends React.Component<RouteComponentProps<any>, IAllEquations> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { equations: [], loading: true };
        fetch(`api/equations?all=true`)
            .then(response => response.json() as Promise<IRestNestedEquation[]>)
            .then(data => {
                this.setState({ equations: data, loading: false });
            });
    }

    /**
     * Render the main view and a loading placeholder when appropriate.
     */
    render() {
        return <div>
            <h1>All Currently Available Equations</h1>
            {this.state.loading
                ? <p>Loading...</p>
                : this.renderEquations(this.state.equations)}
        </div>;
    }

    /**
     * Render a list of equations in panels.
     * Add links for expanding and collapsing each equation.
     * @param equations The equations to render
     */
    renderEquations(equations: IRestNestedEquation[]) {
        return equations.map(equation =>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <NavLink
                        to={equation.main.id.toString() === this.props.match.params.id
                            ? "/AllEquations"
                            : `/AllEquations/${equation.main.id}`}
                        activeClassName="active">
                        {equation.main.equation}
                    </NavLink>
                </div>
                {this.renderCollapsibleEquation(equation)}
            </div>);
    }

    /**
     * Render a single equations detail view.
     * Only render it, if it is selected.
     * @param equation The equation to render
     */
    renderCollapsibleEquation(equation: IRestNestedEquation) {
        if (equation.main.id.toString() !== this.props.match.params.id) {
            return <div className="panel-collapse collapse" aria-expanded="false" />;
        }
        this.props.match.params.id = equation.main.id.toString();
        return <div className="panel-collapse collapse in" aria-expanded="true">
            <div className="panel-body">
                <p>
                    <NavLink to={`/equations/${equation.main.id}`} activeClassName="active">
                        Go to equation
                           </NavLink>
                </p>
                <p>
                    <NavLink to={`/equationcreator/${equation.main.id}`} activeClassName="active">
                        Update this equation
                           </NavLink>
                </p>
                <Equation match={this.props.match}
                    location={this.props.location}
                    history={this.props.history}
                    staticContext={this.props.staticContext} />
            </div>
        </div>;
    }
}
