import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect, useMemo } from "react";
import { auth, db, storage, timestamp } from "./firebase";
import { doc, setDoc, collection, getDocs, query, where, getDoc, addDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
// import { genProducts } from "./SeedDB";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const provider = new GoogleAuthProvider();
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [pictureLoading, setPictureLoading] = useState(true);
    const [categoryIDLoading, setCategoryIDLoading] = useState(true);
    const categoryIDs = useMemo(() => ({
        "Men's clothes": "", 
        "Women's clothes": "", 
        "Shoes": "", 
        "Accessories": ""
    }), []);
    const appsPicture = useMemo(() => ({
        "Logo.png": "",
        "Men clothes.png": "", 
        "Women clothes.png": "", 
        "Shoes.png": "", 
        "Accessories.png": "",
        "User.png": ""
    }), []);

    const signIN = () => {
        signInWithPopup(auth, provider).then(async(result) => {
            // console.log((result.user.photoURL));
            const usersCol = collection(db, "Users");
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
                },
                money: 0
            };
            // setDoc(doc(users), userData);
            const q = query(usersCol, where("email", "==", result.user.email));
            // console.log(typeof(q))
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty){
                const newUserRef = await addDoc(usersCol, userData)
                const newUserData = { id: newUserRef.id, ...userData };
                setUserData(newUserData);
                console.log("Create user data successful")
            }
            else{
                querySnapshot.forEach((doc) => {
                    setUserData({ id: doc.id, ...doc.data() });
                    console.log(doc.id, " => ", doc.data());
                });
            }
            
            // getDocs(q).then(querySnapshot => {
            //     if (querySnapshot.empty){
            //         setDoc(doc(usersCol), userData).then(
            //             console.log("Create user data successful")
            //         ).catch((error) => {
            //             console.log(`Error: ${error}`);
            //         });
            //     }
            //     else{
            //         querySnapshot.forEach((doc) => {
            //             setUserData({ id: doc.id, ...doc.data() });
            //             console.log(doc.id, " => ", doc.data());
            //         });
            //     }
            // }).catch(error => {
            //     console.log(`Error: ${error}`);
            // });
        });
    };

    const getData = async() => {
        let currentDate = new Date();
        let tempDate = new Date();
        let dueDate = new Date(tempDate.setHours(tempDate.getHours() + 8));
        console.log(currentDate);
        console.log(dueDate);
    }

    const signOUT = () => {
        signOut(auth)
    }

    const updateUserData = async(userId) => {
        const userRef = doc(db, "Users", userId);
        getDoc(userRef).then(doc => {
            if (doc.exists()) {
                setUserData(doc.data());
            } 
            else {
                console.log("No such document!");
            }
        }).catch(error => {
            console.log("Error getting document: ", error);
        });
        // const userDoc = await getDoc(userRef);

        // console.log("userDoc:", userDoc); 
        // console.log("userDoc.data():", userDoc.data());

        // if (!userDoc.exists()) {
        //     throw new Error("User not found.");
        // }
        // else {
        //     setUserData(userDoc.data());
        // }
        
        // const userData = userDoc.data();
        // setUserData(userDoc);
    }
    
    useEffect(() => {
        const promises = Object.keys(appsPicture).map(async (key) => {
            // getDownloadURL(ref(storage, `apps/${key}`)).then((url) => {
            //     appsPicture[key] = url;
            // });
            const url = await getDownloadURL(ref(storage, `apps/${key}`));
            appsPicture[key] = url;
        });

        Promise.all(promises).then(() => {
            setPictureLoading(false);
        });
    }, []);
    
    useEffect(() => {
        const fetchCategoryIDs = async() => {
            const categoriesCol = collection(db, "Categories");
            const promises = Object.keys(categoryIDs).map(async (key) => {
                const q = query(categoriesCol, where("categoryName", "==", key));
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    categoryIDs[key] = doc.id;
                });
            });

            await Promise.all(promises);
            setCategoryIDLoading(false);
        };

        fetchCategoryIDs();
    }, [categoryIDs]);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            if (user) {
                const usersCol = collection(db, 'Users');
                const q = query(usersCol, where('email', '==', user.email));
                getDocs(q).then((querySnapshot) => {
                  if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                      setUserData({ id: doc.id, ...doc.data() });
                    });
                  }
                });
            } 
            else {
                setUserData(null);
            }
            setUserLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return(
        <AuthContext.Provider value={{ currentUser, signIN, signOUT, userData, getData, updateUserData, categoryIDs, appsPicture}}>
            {!userLoading && !pictureLoading && !categoryIDLoading && children}
        </AuthContext.Provider>
    );
};