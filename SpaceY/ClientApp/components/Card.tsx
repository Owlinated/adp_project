import * as React from "react";
import { RouteComponentProps } from "react-router";
import { DragSource } from 'react-dnd';


/**
 * Test of drag and drop
 */
export class Card extends React.Component<RouteComponentProps<any>> {
    constructor(props: RouteComponentProps<any>) {
		super(props)
		//this.moveCard = this.moveCard.bind(this)
		this.state = {
			cards: [
				{
					id: 1,
					text: 'Write a cool JS library',
				},
				{
					id: 2,
					text: 'Make it generic enough',
				},
				{
					id: 3,
					text: 'Write README',
				},
				{
					id: 4,
					text: 'Create some examples',
				},
				{
					id: 5,
					text:
						'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
				},
				{
					id: 6,
					text: '???',
				},
				{
					id: 7,
					text: 'PROFIT',
				},
			],
		}
	}

    render() {
        return <div>
                  
               </div>;
    }
    
    
    

    
    
}