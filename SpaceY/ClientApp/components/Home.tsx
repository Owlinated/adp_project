import * as React from "react";
import { RouteComponentProps } from "react-router";
import "isomorphic-fetch";
import { NavLink } from "react-router-dom";
import { IRestEquation } from "../interface/IRestEquation";
import { Equation } from "./Equation";

interface IHomeState {
    equations: IRestEquation[];
    loading: boolean;
}

/**
 * Component for homepage view.
 * Shows a list of commonly used equations.
 */
export class Home extends React.Component<RouteComponentProps<any>, IHomeState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { equations: [], loading: true };
        fetch("api/equations")
            .then(response => response.json() as Promise<IRestEquation[]>)
            .then(data => {
                this.setState({ equations: data, loading: false });
            });
    }

    /**
     * Render the main view and a loading placeholder when appropriate.
     */
    render() {
        return <div>
                   <h1>Most used equations</h1>
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
    renderEquations(equations: IRestEquation[]) {
        return equations.map(equation =>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <NavLink
                        to={equation.id.toString() === this.props.match.params.id
                            ? "/home"
                            : `/home/${equation.id}`}
                        activeClassName="active">
                        {equation.equation}
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
    renderCollapsibleEquation(equation: IRestEquation) {
        if (equation.id.toString() !== this.props.match.params.id) {
            return <div className="panel-collapse collapse" aria-expanded="false"/>;
        }
        return <div className="panel-collapse collapse in" aria-expanded="true">
                   <div className="panel-body">
                       <p>
                           <NavLink to={"/equations/" + equation.id} activeClassName="active">
                               Go to equation
                           </NavLink>
                       </p>
                       <Equation match={this.props.match}
                                 location={this.props.location}
                                 history={this.props.history}
                                 staticContext={this.props.staticContext}/>
                   </div>
               </div>;
    }
}
