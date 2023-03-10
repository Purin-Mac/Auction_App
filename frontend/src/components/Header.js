// import React, { useState, useEffect } from 'react';
import '../style/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../resources/Hammer of the God.png';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
// import firebase, { signInWithGoogle } from '../service/firebase';
// import User from '../service/User';
import Profile from './Profile';

function Header() {
  // const [user, setUser] = useState(null);
  
  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(user => {
  //   setUser(user)
  // })
  // }, []);

  // console.log(user);

  return (
    <>
    <div className="header">
      <div className="slot">
        <Link className="logo" to="/">
          Let's Auct <img src={logo} alt="Official logo" />
        </Link>
      </div>

      <div className="slot">
        <div className="navbar">
          <Link to='/'>Home</Link>
          <Link to='/category'>Categories</Link>
          <Link to="/sell">Sell</Link>
          <a href="/">Contact</a>
        </div>
        </div>

        <div className="slot">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>

        <div className="slot">
          <Profile/>
          {/* {user? user.photoURL && user.displayName : <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button>} */}
          {/* <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button> */}
        </div>
      </div>
    </>
  );
};

export default Header;
