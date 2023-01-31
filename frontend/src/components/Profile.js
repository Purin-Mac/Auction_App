import React, { useContext } from 'react'
import '../style/User.css'
// import { auth, signInWithGoogle } from "../service/firebase";
// import User from "../service/User"
import { AuthContext } from '../service/AuthContext';

function Profile() {
    // const user = User();
    const { currentUser, signIN, signOUT } = useContext(AuthContext)
    // console.log(currentUser)
    if (currentUser) {
        return (
            <>
                <div className="user-container">
                    <h3> {currentUser.displayName}</h3>
                    <img src={currentUser.photoURL} alt="profile_image"/>
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