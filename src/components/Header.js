import React from 'react';
import '../css/Header.css';

const Header = ({ restaurantInfo }) => (
  <header>
    <div className="restaurant-info">
      <div className="logo">
        <img src={restaurantInfo.logo} alt={restaurantInfo.name} />
      </div>
      <h1>{restaurantInfo.name}</h1>
    </div>
  </header>
);

export default Header;