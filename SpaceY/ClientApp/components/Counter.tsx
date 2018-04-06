import * as React from "react";
import { RouteComponentProps } from "react-router";

interface ICounterState {
    currentCount: number;
}

/**
 * Irrelevant component from the template.
 */
export class Counter extends React.Component<RouteComponentProps<any>, ICounterState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { currentCount: 0 };
    }

    render() {
        return <div>
                   <h1>Counter</h1>

                   <p>This is a simple example of a React component.</p>

                   <p>Current count: <strong>{ this.state.currentCount }</strong></p>

                   <button onClick={ () => { this.incrementCounter() } }>Increment</button>
               </div>;
    }

    incrementCounter() {
        this.setState({
            currentCount: this.state.currentCount + 1
        });
    }
}