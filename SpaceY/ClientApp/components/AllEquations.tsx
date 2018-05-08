import "isomorphic-fetch";
import * as React from "react";
import { RouteComponentProps } from "react-router";
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
            .then((response) => response.json() as Promise<IRestNestedEquation[]>)
            .then((data) => {
                this.setState({ equations: data, loading: false });
            });
    }

    /**
     * Render the main view and a loading placeholder when appropriate.
     */
    public render() {
        const equations = this.state.loading
            ? <p>Loading...</p>
            : this.renderEquations(this.state.equations);

        return (
            <div>
                <h1>All Currently Available Equations</h1>
                {equations}
            </div>
        );
    }

    /**
     * Render a list of equations in panels.
     * Add links for expanding and collapsing each equation.
     * @param equations The equations to render
     */
    public renderEquations(equations: IRestNestedEquation[]) {
        return equations.map((equation) => {
            const navLink = equation.main.id.toString() === this.props.match.params.id
                ? "/AllEquations/"
                : `/AllEquations/${equation.main.id}`;

            return (
                <div key={equation.main.id} className="panel panel-default">
                        <div className="panel-heading">
                            <NavLink
                                to={navLink}
                                activeClassName="active"
                            >
                                {equation.main.description}
                            </NavLink>
                        </div>
                        {this.renderCollapsibleEquation(equation)}
                </div>
            );
        });
    }

    public DeleteEquation(eqid: number) {
        if (confirm("Are you sure yoy want to permanently delete this equation?")) {
            fetch(`api/Equations/${eqid}/Delete`,
                    { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" } })
            .then((response) => response.json() as Promise<IRestNestedEquation[]>)
            .then((data) => { this.setState({ equations: data, loading: false }); });
        }
    }

    /**
     * Render a single equations detail view.
     * Only render it, if it is selected.
     * @param equation The equation to render
     */
    public renderCollapsibleEquation(equation: IRestNestedEquation) {
        if (equation.main.id.toString() !== this.props.match.params.id) {
            return <div className="panel-collapse collapse" aria-expanded="false" />;
        }
        this.props.match.params.id = equation.main.id.toString();

        return (
            <div className="panel-collapse collapse in" aria-expanded="true">
                    <div className="panel-body">
                        <p>
                            <NavLink
                                to={`/equations/${equation.main.id}`}
                                activeClassName="active"
                                className="btn-link"
                            >
                                Open
                            </NavLink>
                            &nbsp;|&nbsp;
                            <NavLink
                                to={`/equationcreator/${equation.main.id}`}
                                activeClassName="active"
                                className="btn-link"
                            >
                                Update
                            </NavLink>
                            &nbsp;|&nbsp;
                            <a
                                onClick={() => this.DeleteEquation(equation.main.id)}
                                className="btn-link eq-nav-link"
                            >
                                Delete
                            </a>
                        </p>
                        <Equation {...equation}/>
                    </div>
            </div>
        );
    }
}
