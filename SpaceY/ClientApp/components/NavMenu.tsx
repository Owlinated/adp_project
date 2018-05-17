import * as React from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * The navigation menu, which is used for switching between views.
 */
export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="main-nav">
                <div className="navbar navbar-inverse">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle"
                            data-toggle="collapse"
                            data-target=".navbar-collapse"
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                        <Link className="navbar-brand" to={"/"} style={{height: "65px", fontSize: "30px"}}>
                            <span style={{paddingRight: "10px"}}>
                                <img height="32px" src="icon.png" />
                            </span>
                            SpaceY
                        </Link>
                    </div>
                    <div className="clearfix"/>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li>
                                <NavLink to={"/home/"} activeClassName="active">
                                    <span className="glyphicon glyphicon-sunglasses"/> Most Used Equations
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={"/equationcreator/"} activeClassName="active">
                                    <span className="glyphicon glyphicon-plus-sign"/> New Equation
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={"/allequations/"} activeClassName="active">
                                    <span className="glyphicon glyphicon-th-list"/> All Equations
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
