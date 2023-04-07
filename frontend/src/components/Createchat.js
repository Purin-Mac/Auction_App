import {
    addDoc,
    collection,
    doc,
    getDocs,
    or,
    query,
    where,
} from "firebase/firestore";
import React, { useContext } from "react";
import { db } from "../service/firebase";
import { AuthContext } from "../service/AuthContext";
import { useNavigate } from "react-router-dom";

const Createchat = ({ sellerData }) => {
    const { currentUser, userData, setcurrentChat} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChat = () => {
        // console.log(userData);
        // console.log(sellerData);
        const chatsCol = collection(db, "Chats");
        const userRef = doc(db, "Users", userData.id);
        const sellerRef = doc(db, "Users", sellerData.id);
        const q = query(
            chatsCol,
            where("buyerEmail", "in", [currentUser.email, sellerData.email]),
            where("sellerEmail", "in", [currentUser.email, sellerData.email])
        );
        getDocs(q).then(async (querySnapshot) => {
            if (querySnapshot.empty) {
                await addDoc(chatsCol, {
                    buyerEmail: currentUser.email,
                    buyerRef: userRef,
                    sellerEmail: sellerData.email,
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
