import * as React from "react";
import { Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { FetchData } from "./components/FetchData";
import { Counter } from "./components/Counter";
import { Dashboard } from "./components/Dashboard";
import { Equation } from "./components/Equation";
import { withRouter } from 'react-router-dom'

export const routes = <Layout>
                          <Route exact path="/" component={ Home }/>
                          <Route path="/counter" component={ Counter }/>
                          <Route path="/fetchdata" component={ FetchData }/>
                          <Route path="/dashboard/:id?" component={withRouter(Dashboard)}/>
                          <Route path="/equations/:id" component={withRouter(Equation) }/>
                      </Layout>;