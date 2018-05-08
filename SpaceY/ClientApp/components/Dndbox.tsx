import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DragSource } from "react-dnd";
import { RouteComponentProps } from "react-router";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";
import { Equation } from "./Equation";
import { Home } from "./Home";

/**
 * Test of drag and drop
 */
interface IDndState {
    items: any[];
}

// Generate list items
const getItems = (count: number) => {
    return Array.from({ length: count }, (v, k) => k).map((k) => ({
        content: "equation " + k,
        id: "item-" + k,
    }));
};

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // change background colour when dragging item
    background: isDragging ? "lightgreen" : "lightgrey",

    // some basic styles for the items
    margin: `0 0 ${8}px 0`,
    padding: 20,
    userSelect: "none",

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "white" : "white",
    padding: 8,
    width: 500,
});

export class Dndbox extends React.Component<RouteComponentProps<any>, IDndState> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.state = {
      items: getItems(10),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  public onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      getItems(10),
      result.source.index,
      result.destination.index,
    );

    this.setState({
      items,
    });
  }

  public render() {
        const innerDragableCallback = (item: any) => (providedInner: any, snapshotInner: any) => (
            <div
                ref={providedInner.innerRef}
                {...providedInner.draggableProps}
                {...providedInner.dragHandleProps}
                style={getItemStyle(snapshotInner.isDragging, providedInner.draggableProps.style)}
            >
                {item.content}
            </div>
        );

        const itemMapper = (item: any, index: any) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
                {innerDragableCallback(item)}
            </Draggable>
        );

        const dragableCallback = (provided: any, snapshot: any) => (
            <div
                ref={provided.innerRef}
                // style={getListStyle(snapshot.isDraggingOver)}            >
                {this.state.items.map(itemMapper)}
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
}

/*

export class Dndbox extends React.Component<RouteComponentProps<any>> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { currentCount: 0 };
    }

    render() {
        return <div>
                   <h1>TEST</h1>

               </div>;
    }

}
*/
