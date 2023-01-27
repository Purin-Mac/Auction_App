import { useEffect, useState } from 'react'
import firebase, { auth, signInWithGoogle } from "./firebase";
import "../style/User.css"

function User() {
    const [user, setUser] = useState(null);
    useEffect(() => {
            firebase.auth().onAuthStateChanged(user => {
            setUser(user)
        })
    }, []);

    console.log(user);

    if (user) {
        return (
            <>
                <div class="user-container">
                    <h3> {user.displayName}</h3>
                    <img src={user.photoURL} alt="profile_image"/>
                </div>
                <button onClick={() => auth.signOut()}>Sign out</button>
            </>
        );
    }else{
        return (
            <>
                <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button>
            </>
        )
    };
}

export default User