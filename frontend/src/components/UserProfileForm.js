import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../service/AuthContext';
import { Link } from 'react-router-dom';
import '../style/Profile.css';

function ProfileForm() {

  const { userData } = useContext(AuthContext)

  return (

        <div className='UserProfileMain'>
          
            <div className='UserInfo'>
                <h2>Profile</h2>
                <p>Username : {userData.userName}</p>
                <p>Email Address : {userData.email}</p>
                <p>Firstname : {userData.firstName}</p>
                <p>Lastname : {userData.lastName}</p>
                <p>Address : {userData.address.street}, {userData.address.city}, {userData.address.state}, {userData.address.zip}</p>
                <p>Identity Number : {userData.numberID}</p>
                <p>Phone Number : {userData.phoneNumber}</p>
                <Link to="/editprofile">
                        <button>Edit your profile</button>
                </Link>
            </div>
        </div>

  )
}

export default ProfileForm
