import React, { useContext, useEffect, useState } from 'react'
import '../style/User.css'
// import { auth, signInWithGoogle } from "../service/firebase";
import { AuthContext } from '../service/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../service/firebase';
import { Link } from 'react-router-dom';

function Profile() {
    const { currentUser, userData, signIN, signOUT, updateUserData, appsPicture } = useContext(AuthContext)
    const [ userMoney, setUserMoney] = useState(0);
    // console.log(currentUser)

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

    if (currentUser && userData) {
        // console.log(userData)
        return (
            <>
                <div className="user-container">
                    <Link className="user-link" to="/profile">
                        <div className="user-info">
                            <img src={currentUser.photoURL} alt="profile" onError={(e) => {e.target.onerror = null; e.target.src = appsPicture["User.png"]}}/>
                            <h3> {currentUser.displayName}</h3>
                        </div>
                    </Link>
                    <h6> {userMoney?.toLocaleString()} THB</h6>
                </div>
                {/* <button onClick={() => auth.signOut()}>Sign out</button> */}
                {/* <button onClick={() => signOUT()}>Sign out</button> */}
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