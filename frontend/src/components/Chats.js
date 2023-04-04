import React, { useContext, useEffect, useState } from "react";
import "../style/main.css";
import {
    collection,
    getDoc,
    onSnapshot,
    or,
    query,
    where,
} from "firebase/firestore";
import { db } from "../service/firebase";
import { AuthContext } from "../service/AuthContext";

export const Chats = () => {
    const { currentUser } = useContext(AuthContext);
    const [chatrooms, setChatrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const chatsCol = collection(db, "Chats");
        const q = query(
            chatsCol,
            or(
                where("buyerEmail", "==", currentUser.email),
                where("sellerEmail", "==", currentUser.email)
            )
        );
        const unsub = onSnapshot(q, async (querySnapshot) => {
            const chatroomsTemp = [];
            const promises = [];
            querySnapshot.forEach((doc) => {
              const chatroomData = doc.data();
              const buyerRef = chatroomData.buyerRef;
              const sellerRef = chatroomData.sellerRef;
              const buyerPromise = getDoc(buyerRef);
              const sellerPromise = getDoc(sellerRef);
              promises.push(buyerPromise, sellerPromise);
              const chatroom = {
                id: doc.id,
                ...chatroomData,
              };
              chatroomsTemp.push(chatroom);
            });
            const results = await Promise.all(promises);
            for (let i = 0; i < results.length; i += 2) {
              const buyerData = results[i].data();
              const sellerData = results[i + 1].data();
              chatroomsTemp[i / 2].buyer = { ...buyerData };
              chatroomsTemp[i / 2].seller = { ...sellerData };
            }
            setChatrooms(chatroomsTemp);
            setIsLoading(false);
          });

        return () => {
            unsub();
        };
    }, [currentUser.email]);

    // console.log(chatrooms);

    if (isLoading) {
        return <h3>Loading chatrooms...</h3>;
    }

    // if (chatrooms.length === 0) {
    //     console.log(chatrooms);
    //     return <h3>No chatrooms found.</h3>;
    // }

    return (
        <div className="Chats">
            {chatrooms.length !== 0 ? (
                chatrooms.map((chatroom) => (
                    <div className="userChat" key={chatroom.id}>
                        <img
                            src={
                                chatroom.buyer.buyerEmail === currentUser.email
                                    ? chatroom.seller.userPhoto
                                    : chatroom.buyer.userPhoto
                            }
                            alt="userPic"
                        />
                        <div className="userChatInfo">
                            <span>
                                {chatroom.buyer.buyerEmail === currentUser.email
                                    ? chatroom.seller.userName
                                    : chatroom.buyer.userName}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <h3>{chatrooms.length}</h3>
            )}
        </div>
    );
};
