import React from 'react';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import { NavMenu } from '../NavMenu';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Navigation Menu Component', () => {
    it('renders without crashing.', () => {
        expect(shallow(<NavMenu />).exists(<div className="navbar navbar-inverse"></div>)).toBe(true)
    });

    it('creates at least three links.', () => {
        expect(shallow(<NavMenu />).find('NavLink').length).toBeGreaterThanOrEqual(3);
    });

    it('the first link leads to the homepage', () => {

    })
})
