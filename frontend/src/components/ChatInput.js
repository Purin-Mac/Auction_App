import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/main.css";
import { AuthContext } from "../service/AuthContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db, storage } from "../service/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const ChatInput = ({ setImgPreview }) => {
    const { currentUser, currentChat } = useContext(AuthContext);
    const [messageImg, setMessageImg] = useState(null);
    const message = useRef("");

    const handleSendMessage = async () => {
        const messagesRef = collection(db, "Chats", currentChat, "Messages");
        let newMessage = {
            senderEmail: currentUser.email,
            message: message.current.value,
            sendTime: Timestamp.now(),
        };
        if (messageImg) {
            // const imageRef = ref(storage, `images/${productsData.productName}`);
            // uploadBytes(imageRef, productsData.productPhoto).then((snapshot) => {
            //     console.log('Uploaded a file!');
            //     getDownloadURL(ref(storage, `images/${productsData.productName}`)).then((url) => {
            //         // console.log(url);
            //         productsData.productPhoto = url;
            //         const productCol = collection(db, "Products");
            //         addDoc((productCol), productsData);
            //         navigate(`/category_product?id=${categoryID}`);
            //     });
            // });

            const storageRef = ref(
                storage,
                `Chats/${currentChat}/${messageImg.name}`
            );
            uploadBytes(storageRef, messageImg).then((snapshot) => {
                console.log("Uploaded a file!");
                getDownloadURL(storageRef).then(async (url) => {
                    newMessage = {
                        ...newMessage,
                        messageImg: url,
                    };
                    try {
                        await addDoc(messagesRef, newMessage);
                        message.current.value = "";
                        setImgPreview(null)
                    } catch (error) {
                        console.error("Error sending message: ", error);
                    }
                });
            });
        } else if (message.current.value !== "") {
            try {
                await addDoc(messagesRef, newMessage);
                message.current.value = "";
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSendMessage();
    };

    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        setMessageImg(file);
        setImgPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        message.current.value = "";
    }, [currentChat]);

    return (
        <div className="ChatInput">
            <input
                type="text"
                placeholder="Type Something"
                ref={message}
                onKeyDown={(e) => handleKey(e)}
            />
            <div className="send">
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="file"
                    onChange={(e) => handleImagePreview(e)}
                />
                <label htmlFor="file">
                    <img
                        src="https://static.thenounproject.com/png/59103-200.png"
                        alt=""
                    />
                </label>
                <button onClick={() => handleSendMessage()}>Send</button>
            </div>
        </div>
    );
};
