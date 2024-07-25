import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
  <header>
    <h1>Work Order Management</h1>
    <nav>
      <NavLink to="/" exact activeClassName="active">Home</NavLink>
      <NavLink to="/executed-orders" activeClassName="active">Executed Orders</NavLink>
    </nav>
  </header>
);

export default Header;
