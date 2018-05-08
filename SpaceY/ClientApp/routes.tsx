import * as React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { AllEquations } from "./components/AllEquations";
import { Dndbox } from "./components/Dndbox";
import { EquationCreator } from "./components/EquationCreator";
import { EquationDetail } from "./components/EquationDetail";
import { Home } from "./components/Home";
import { Layout } from "./components/Layout";

/**
 * Routing for urls on the website.
 * It will try to match one of the components.
 * If none match, we redirect to the home page.
 */
export const routes = (
    <Layout>
        <Switch>
            <Route path="/home/:id([0-9]*)" component={withRouter(Home)}/>
            <Route path="/equationcreator/:id([0-9]*)" component={withRouter(EquationCreator)}/>
            <Route path="/dndbox" component={Dndbox}/>
            <Route path="/AllEquations/:id([0-9]*)" component={withRouter(AllEquations)}/>
            <Route path="/equations/:id([0-9]+)" component={withRouter(EquationDetail)}/>
            <Redirect to="/home/"/>
        </Switch>
    </Layout>
);
