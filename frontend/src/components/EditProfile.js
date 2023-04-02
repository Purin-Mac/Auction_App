import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../service/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../service/firebase';
import '../style/Profile.css';

function EditProfile() {

  const { currentUser, userData } = useContext(AuthContext)
  const [ userMoney, setUserMoney] = useState(0);

  useEffect(() => {
    if (userData) {
        const userDocRef = doc(db, "Users", userData.id);
        const unsub = onSnapshot(userDocRef, (doc) => {
            setUserMoney(doc.data().money);
            // console.log(doc.id)
        });

        return () => {
            unsub();
        };
    }
  }, [userData]);

  return (
        <div className='UserProfileMain'>
        <div className='EditProfile'>
            <div className='UserInfo'>
                <h2>Edit Your Profile</h2>
                <p>Username : {currentUser.displayName}</p>
                <p>Email Address : {currentUser.email}</p>
                <p>Your Money : {userMoney}</p>
                <p>Firstname : {userData.firstName}</p>
                <p>Lastname : {userData.lastName}</p>
                <p>Address : {userData.address.street}, {userData.address.city}, {userData.address.state}, {userData.address.zip}</p>
                <p>Identity Number : {userData.numberID}</p>
                <p>Phone Number : {userData.phoneNumber}</p>
                <button type='submit'>Save your profile</button>
            </div>
        </div>
        </div>

  )
}

export default EditProfile
