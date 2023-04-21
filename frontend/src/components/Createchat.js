import {
    addDoc,
    collection,
    doc,
    getDocs,
    or,
    query,
    where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../service/firebase";
import { AuthContext } from "../service/AuthContext";
import { useNavigate } from "react-router-dom";
import '../style/main.css';


const Createchat = ({ sellerData, sellerEmail }) => {
    const { currentUser, userData, setcurrentChat} = useContext(AuthContext);
    const [sellerUserData, setSellerUserData] = useState("");
    const navigate = useNavigate();

    //get seller data
    useEffect(() => {
        if (!sellerData && sellerEmail) {
            const usersCol = collection(db, "Users");
            const q = query(usersCol, where("email", "==", sellerEmail));
            getDocs(q).then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const sellerDataTemp = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
                    setSellerUserData(sellerDataTemp);
                } else {
                    console.log("No seller found.");
                }
            });
        }
    }, [sellerData, sellerEmail]);

    const handleChat = () => {
        // console.log(userData);
        // console.log(sellerData);
        const chatsCol = collection(db, "Chats");
        const userRef = doc(db, "Users", userData.id);
        const sellerRef = doc(db, "Users", sellerData?.id || sellerUserData.id);
        const sellerEmailToUse = sellerData?.email || sellerUserData.email;
        const q = query(
            chatsCol,
            where("buyerEmail", "in", [currentUser.email, sellerEmailToUse]),
            where("sellerEmail", "in", [currentUser.email, sellerEmailToUse])
        );
        getDocs(q).then(async (querySnapshot) => {
            if (querySnapshot.empty) {
                await addDoc(chatsCol, {
                    buyerEmail: currentUser.email,
                    buyerRef: userRef,
                    sellerEmail: sellerEmailToUse,
                    sellerRef: sellerRef,
                }).then((docRef) => {
                    setcurrentChat(docRef.id);
                });
                navigate("/messager");
            } else {
                setcurrentChat(querySnapshot.docs[0].id);
                navigate("/messager");
            }
        });
    };

    return <button onClick={handleChat}>Chat With Seller</button>;
};

export default Createchat;
