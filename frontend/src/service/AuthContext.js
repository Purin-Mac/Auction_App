import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const provider = new GoogleAuthProvider();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signIN = () => {
        signInWithPopup(auth, provider).then((result) => {
            // console.log((result.user.photoURL));
            const users = collection(db, "Users");
            const userData = {
                // uid: result.user.uid,
                userName: result.user.displayName,
                // userPhoto: result.user.photoURL,
                firstName: null,
                lastName: null,
                email: result.user.email,
                numberID: null,
                phoneNumber: result.user.phoneNumber,
                address: {
                    street: null,
                    city: null,
                    state: null,
                    zip: null
                }
            };
            // setDoc(doc(users), userData);
            const q = query(users, where("email", "==", result.user.email));
            getDocs(q).then(querySnapshot => {
                if (querySnapshot.empty){
                    setDoc(doc(users), userData);
                    console.log("Create user data successful");
                }
                else{
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                    });
                }
            }).catch(error => {
                console.log(`Error: ${error}`);
            });
        });
    };

    // const queryData = async(collection, keyword, operator, value) => {
    //     const q = query(collection, where(keyword, operator, value));
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // }

    const getData = async() => {
        const docCol = collection(db, "Users");
        // console.log(docCol);
        const docAll = await getDocs(docCol);
        // console.log(docAll);
        docAll.forEach(doc => {
            console.log(doc.id, " => ", doc.data());
        });
    }

    const signOUT = () => {
        signOut(auth)
    }
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return(
        <AuthContext.Provider value={{ currentUser, signIN, signOUT, getData}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};