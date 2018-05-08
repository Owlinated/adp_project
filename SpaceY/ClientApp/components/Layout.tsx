import * as React from "react";
import { NavMenu } from "./NavMenu";

export interface ILayoutProps {
    children?: React.ReactNode;
}

/**
 * A component for the basic site layout.
 * This consists of the navigation menu, and the current view.
 */
export class Layout extends React.Component<ILayoutProps, {}> {
    public render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3">
                        <NavMenu/>
                    </div>
                    <div className="col-sm-9">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
