import * as React from "react";
import { RouteComponentProps } from "react-router";
import "isomorphic-fetch";
import { NavLink } from "react-router-dom";
import { IRestEquation } from "../types/IRestEquation";

interface IFetchDataExampleState {
    equations: IRestEquation[];
    loading: boolean;
}

export class Dashboard extends React.Component<RouteComponentProps<any>, IFetchDataExampleState> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = { equations: [], loading: true };

        fetch("api/Equations/List")
            .then(response => response.json() as Promise<IRestEquation[]>)
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

    private static renderForecastsTable(forecasts: IRestEquation[]) {
        return <table className="table">
                   <thead>
                   <tr>
                       <th>Equation</th>
                   </tr>
                   </thead>
                   <tbody>
                   {forecasts.map(equation =>
                       <tr key={ equation.id }>
                           <td>
                               <NavLink to={"/equations/" + equation.id} activeClassName="active">
                                   {equation.equation}
                               </NavLink>
                           </td>
                       </tr>
                   )}
                   </tbody>
               </table>;
    }
}
