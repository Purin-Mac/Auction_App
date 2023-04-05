import React, { useContext, useEffect, useState } from "react";
import { Message } from "./Message";
import "../style/main.css";
import { AuthContext } from "../service/AuthContext";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { db } from "../service/firebase";

export const Messages = ({ imgPreview }) => {
    const { currentUser, currentChat } = useContext(AuthContext);
    const [chatData, setChatData] = useState([]);
    const [anotherUserData, setAnotherUserData] = useState([]);
    const [messages, setMessages] = useState([]);

    //get chatroom data
    useEffect(() => {
        if (currentChat) {
            const chatRef = doc(db, "Chats", currentChat);
            getDoc(chatRef).then((doc) => {
                if (doc.exists()) {
                    setChatData({ id: doc.id, ...doc.data() });
                } else {
                    console.log("No such document!");
                }
            });
        }
    }, [currentChat]);

    //get seller data
    useEffect(() => {
        if (chatData.sellerRef && chatData.sellerEmail !== currentUser.email) {
            getDoc(chatData.sellerRef).then((doc) => {
                if (doc.exists()) {
                  setAnotherUserData({ id: doc.id, ...doc.data() });
                } else {
                    console.log("No such document!");
                }
            });
        }
        else if (chatData.buyerRef && chatData.buyerEmail !== currentUser.email) {
          getDoc(chatData.buyerRef).then((doc) => {
              if (doc.exists()) {
                  setAnotherUserData({ id: doc.id, ...doc.data() });
              } else {
                  console.log("No such document!");
              }
          });
        }
    }, [chatData.sellerRef, chatData.buyerRef, chatData.sellerEmail, chatData.buyerEmail, currentUser.email]);

    // console.log(anotherUserData)

    useEffect(() => {
        if (currentChat) {
            const messagesRef = collection(
                db,
                "Chats",
                currentChat,
                "Messages"
            );
            const q = query(messagesRef, orderBy("sendTime"));
            const unsub = onSnapshot(q, (querySnapshot) => {
                const updatedMessages = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(updatedMessages);
            });

            return () => {
                unsub();
            };
        }
    }, [currentChat]);

    return (
        <div className="Message2">
            <Message chatData={chatData} anotherUserData={anotherUserData} messages={messages} />
            {imgPreview && (
              <div className="img-preview">
                    <img src={imgPreview} alt="Preview" />
                </div>
            )}
        </div>
    );
};
