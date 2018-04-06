import * as React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { FetchData } from "./components/FetchData";
import { Counter } from "./components/Counter";
import { Equation } from "./components/Equation";
import { withRouter } from 'react-router-dom'

export const routes =
    <Layout>
        <Switch>
            <Route path="/home/:id([0-9]*)" component={ withRouter(Home) }/>
            <Route path="/counter" component={ Counter }/>
            <Route path="/fetchdata" component={ FetchData }/>
            <Route path="/equations/:id([0-9]+)" component={withRouter(Equation)}/>
            <Redirect to="/home/"/>
        </Switch>
    </Layout>;