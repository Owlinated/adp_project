import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DragSource } from "react-dnd";
import { RouteComponentProps } from "react-router";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";
import { Equation } from "./Equation";
import { Home } from "./Home";

import "isomorphic-fetch";
import { NavLink } from "react-router-dom";

interface IDndState {
    equations: IRestNestedEquation[];
    loading: boolean;
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export class Dndbox extends React.Component<RouteComponentProps<any>, IDndState> {
  constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { equations: [], loading: true };
        this.onDragEnd = this.onDragEnd.bind(this);
        this.getItems();
  }

  public getItems() {
      fetch(`api/equations?all=true`)
          .then((response) => response.json() as Promise<IRestNestedEquation[]>)
          .then((data) => {
              this.setState({ equations: data, loading: false });
          });
    }

  public onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
          this.state.equations,
      result.source.index,
      result.destination.index,
    );

    this.setState({
          equations: items,
        });
    }

  public render() {

        const innerDragableCallback = (item: any) => (providedInner: any, snapshotInner: any) => (
            <div
                ref={providedInner.innerRef}
                {...providedInner.draggableProps}
                {...providedInner.dragHandleProps}
            >
                {this.renderEquations(item)}
            </div>
        );

        const itemMapper = (item: any, index: any) => (
            <Draggable key={item.main.id} draggableId={item.main.id} index={index}>
                {innerDragableCallback(item)}
            </Draggable>
        );

        const dragableCallback = (provided: any, snapshot: any) => (
            <div
                ref={provided.innerRef}
                // style={getListStyle(snapshot.isDraggingOver)}
            >
                {this.state.equations.map(itemMapper)}
                {provided.placeholder}
            </div>
        );

        return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
            {dragableCallback}
        </Droppable>
      </DragDropContext>
    );
    }

    /**
     * Render a list of equations in panels.
     * Add links for expanding and collapsing each equation.
     * @param equations The equations to render
     */
  public renderEquations(equation: IRestNestedEquation) {

            const navLink = equation.main.id.toString() === this.props.match.params.id
                ? "/Dndbox/"
                : `/Dndbox/${equation.main.id}`;

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
    }

  public DeleteEquation(eqid: number) {
        if (confirm("Are you sure yoy want to permanently delete this equation?")) {
            fetch(`api/Equations/${eqid}/Delete?all=true`,
                {
                    headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    method: "POST",
                })
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
                    <Equation {...equation} />
                </div>
            </div>
        );
    }

}
