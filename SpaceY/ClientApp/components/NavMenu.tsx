import * as React from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * The navigation menu, which is used for switching between views.
 */
export class NavMenu extends React.Component<{}, {}> {
    render() {
        return <div className="main-nav">
                   <div className="navbar navbar-inverse">
                       <div className="navbar-header">
                           <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                               <span className="sr-only">Toggle navigation</span>
                               <span className="icon-bar"></span>
                               <span className="icon-bar"></span>
                               <span className="icon-bar"></span>
                               <span className="icon-bar"></span>
                           </button>
                           <Link className="navbar-brand" to={ "/" }>SpaceY</Link>
                       </div>
                       <div className="clearfix"></div>
                       <div className="navbar-collapse collapse">
                           <ul className="nav navbar-nav">
                               <li>
                                   <NavLink to={ "/home" } activeClassName="active">
                                       <span className="glyphicon glyphicon-sunglasses"></span> Home
                                   </NavLink>
                               </li>
                               <li>
                                   <NavLink to={"/equationcreator"} activeClassName="active">
                                        <span className="glyphicon glyphicon-plus-sign"></span> New Equation
                                   </NavLink>
                               </li>
                               <li>
                                   <NavLink to={ "/dndbox" } activeClassName="active">
                                       <span className="glyphicon glyphicon-tasks"></span> DnD Test
                                   </NavLink>
                               </li>
                                <li>
                                    <NavLink to={"/AllEquations"} activeClassName="active">
                                        <span className="glyphicon glyphicon-th-list"></span> All Equations
                                   </NavLink>
                        </li>
                           </ul>
                       </div>
                   </div>
               </div>;
    }
}