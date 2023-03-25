import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect, useMemo } from "react";
import { auth, db, storage, timestamp } from "./firebase";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
// import { genProducts } from "./SeedDB";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const provider = new GoogleAuthProvider();
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const categoryID = useMemo(() => ({
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
        "Accessories.png": ""
    }), []);

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
                },
                money: 0
            };
            // setDoc(doc(users), userData);
            const q = query(users, where("email", "==", result.user.email));
            // console.log(typeof(q))
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
        let currentDate = new Date();
        let tempDate = new Date();
        let dueDate = new Date(tempDate.setHours(tempDate.getHours() + 8));
        console.log(currentDate);
        console.log(dueDate);

        // const docCol = collection(db, "Users");
        // // console.log(docCol);
        // const docAll = await getDocs(docCol);
        // // console.log(docAll);
        // if (docAll.empty) {
        //     console.log("There is no documents.");
        // }
        // else{
        //     docAll.forEach(doc => {
        //         console.log(doc.id, " => ", doc.data());
        //     });
        // }

        // const users = collection(db , "Users");
        // const q = query(users, where("email", "==", currentUser.email));
        // const querySnapshot = await getDocs(q)
        // querySnapshot.forEach(doc => {
        //     console.log(doc.id, " => ", doc.data());
        // });

        // const docCol = collection(db, "Categories");
        // const categoryDict = {
        //     "Men's clothes": "", 
        //     "Women's clothes": "", 
        //     "Shoes": "", 
        //     "Accessories": ""
        // };
        // Object.keys(categoryDict).forEach(async (key) => {
        //     const q = query(docCol, where("categoryName", "==", key));
        //     const querySnapshot = await getDocs(q)
        //     querySnapshot.forEach((doc) => {
        //         // doc.data() is never undefined for query doc snapshots
        //         // console.log(doc.id, " => ", doc.data());
        //         // console.log(typeof(doc.id))
        //         // (function (key) {
        //             categoryDict[key] = doc.id;
        //         // })
        //     });
        // });
        // genProducts(db)
    }

    const signOUT = () => {
        signOut(auth)
    }

    const updateUserDataMoney = (newMoneyValue) => {
        setUserData((prevUser) => ({
          ...prevUser,
          money: newMoneyValue,
        }));
    }

    // const getCategoryPictureURL = (PictureName) => {
    //     return getDownloadURL(ref(storage, `apps/Categories/${PictureName}`)).then((url) => {
    //         // console.log(url);
    //         return url;
    //     });
    // };
    // getCategoryPictureURL("Shoes.png").then(url => console.log(url));    
    
    useEffect(() => {
        Object.keys(appsPicture).forEach(async (key) => {
            getDownloadURL(ref(storage, `apps/${key}`)).then((url) => {
                appsPicture[key] = url;
            });
        });
    }, []);
    
    useEffect(() => {
        const categoriesCol = collection(db, "Categories");
        Object.keys(categoryID).forEach(async (key) => {
            const q = query(categoriesCol, where("categoryName", "==", key));
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                categoryID[key] = doc.id;
            });
        });
    }, [categoryID]);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            if (user) {
                const users = collection(db, 'Users');
                const q = query(users, where('email', '==', user.email));
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
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return(
        <AuthContext.Provider value={{ currentUser, signIN, signOUT, userData, getData, updateUserDataMoney, categoryID, appsPicture}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};