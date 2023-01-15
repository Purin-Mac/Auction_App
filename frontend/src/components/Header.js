// import React, { useState, useEffect } from 'react';
import '../style/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../resources/Hammer of the God.png';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
// import firebase, { signInWithGoogle } from '../service/firebase';
import User from '../service/User';

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
        <a className="logo" href="/">
          Website name <img src={logo} alt="Official logo" />
        </a>
      </div>

      <div className="slot">
        <div className="navbar">
          <Link to='/'>Home</Link>
          <Link to='/category'>Categories</Link>
          <a href="/">Sell</a>
          <a href="/">Contact</a>
        </div>
        </div>

        <div className="slot">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>

        <div className="slot">
          <User/>
          {/* {user? user.photoURL && user.displayName : <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button>} */}
          {/* <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button> */}
        </div>
      </div>
    </>
  );
};

export default Header;
