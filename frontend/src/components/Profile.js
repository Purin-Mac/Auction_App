import React, { useContext } from 'react'
import '../style/User.css'
// import { auth, signInWithGoogle } from "../service/firebase";
import { AuthContext } from '../service/AuthContext';

function Profile() {
    const { currentUser, userData, signIN, signOUT } = useContext(AuthContext)
    // console.log(currentUser)

    if (currentUser && userData) {
        console.log(userData)
        return (
            <>
                <div className="user-container">
                    <h3> {currentUser.displayName}</h3>
                    <img src={currentUser.photoURL} alt="profile_image"/>
                    <h6> {userData.money} THB</h6>
                </div>
                {/* <button onClick={() => auth.signOut()}>Sign out</button> */}
                <button onClick={() => signOUT()}>Sign out</button>
            </>
        );
    }else{
        return (
            <>
                {/* <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button> */}
                <button className="SignIn" id="SignIn" onClick={() => signIN()}>Sign in with google</button>
            </>
        )
    };
}

export default Profile