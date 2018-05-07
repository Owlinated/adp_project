import * as React from "react";
import { RouteComponentProps } from "react-router";
import { DragSource } from 'react-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Equation } from "./Equation";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";
import { Home } from "./Home";




/**
 * Test of drag and drop
 */
 interface dndState {
    items: Array<any>;
}

//Generate list items
var getItems = function getItems(count: number) {
  return Array.from({ length: count }, function (v, k) {
    return k;
  }).map(function (k) {
    return {
      id: "item-" + k,
      content: "equation " + k
    };
  });
};
  
const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles for the items 
  userSelect: 'none',
  padding: 20,
  margin: `0 0 ${8}px 0`,

  // change background colour when dragging item
  background: isDragging ? 'lightgreen' : 'lightgrey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

var getListStyle = function getListStyle(isDraggingOver: any) {
  return {
    background: isDraggingOver ? 'white' : 'white',
    padding: 8,
    width: 500
  };
};


 
export class Dndbox extends React.Component<RouteComponentProps<any>, dndState> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.state = {
      items: getItems(10),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      getItems(10),
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }
   
  render() {

    return (
     /*
    <div>
                   <h1>Most used equations</h1>
                   
                   
                   
               </div>
      */
    
   
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              //style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
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