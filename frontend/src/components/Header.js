import React from 'react';
import '../style/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../resources/Hammer of the God.png';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
// import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">
      <div className="slot">
        <a className="logo" href="/">
          Website name <img src={logo} alt="Official logo" />
        </a>
      </div>

      <div className="slot">
        <div className="navbar">
          <a href="/">Home</a>
          <a href="/">Categories</a>
          <a href="/">Sell</a>
          <a href="/">Contact</a>
        </div>
      </div>

      <div className="slot">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>

      <div className="slot">
        <button className="SignIn">Sign in</button>
      </div>
    </div>
  );
};

export default Header;
