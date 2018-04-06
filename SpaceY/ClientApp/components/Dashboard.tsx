import * as React from "react";
import { RouteComponentProps } from "react-router";
import "isomorphic-fetch";

interface IFetchDataExampleState {
    equations: Equation[];
    loading: boolean;
}

export class Dashboard extends React.Component<RouteComponentProps<any>, IFetchDataExampleState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { equations: [], loading: true };

        fetch("api/Equations")
            .then(response => response.json() as Promise<Equation[]>)
            .then(data => {
                this.setState({ equations: data, loading: false });
            });
    }

    render() {
        const contents = this.state.loading
            ? <p>
                  <em>Loading...</em>
              </p>
            : Dashboard.renderForecastsTable(this.state.equations);

        return <div>
                   <h1>Most used equations</h1>
                   { contents }
               </div>;
    }

    private static renderForecastsTable(forecasts: Equation[]) {
        return <table className="table">
                   <thead>
                   <tr>
                       <th>Equation</th>
                   </tr>
                   </thead>
                   <tbody>
                   {forecasts.map(equation =>
                       <tr key={ equation.equation }>
                           <td>{ equation.equation }</td>
                       </tr>
                   )}
                   </tbody>
               </table>;
    }
}

interface Equation {
    equation: string;
}