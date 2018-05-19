import "isomorphic-fetch";
import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DragSource } from "react-dnd";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";
import { Equation } from "./Equation";

interface IHomeState {
    equations: IRestNestedEquation[];
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
        this.getItems();
    }

    public getItems() {
        fetch(`api/equations?all=false`)
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
                <h2>Most Used Equations</h2>
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
                ? "/home"
                : `/home/${equation.main.id}`;

            return (
                <div key="equation panel" className="panel panel-default">
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
            fetch(`api/Equations/${eqid}/Delete`)
                .then((response) => response.json() as Promise<boolean>)
                .then((result) => {
                    if (result) {
                        this.getItems();
                    } else {
                        alert("Cannot delete equation because it is being referenced by another one.");
                    }
                });
        }
    }

    /**
     * Render a single equations detail view.
     * Only render it, if it is selected.
     * @param equation The equation to render
     */
    public renderCollapsibleEquation(equation: IRestNestedEquation) {
        if (equation.main.id.toString() !== this.props.match.params.id) {
            return <div className="panel-collapse collapse" aria-expanded="false"/>;
        }

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
