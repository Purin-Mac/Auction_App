import React from 'react'
import firebase from '../service/firebase';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    return (
      // alert("You need to log in first."),
      <Navigate to="/" />
    )
  } else {
    return children;
  }
}

export default PrivateRoute