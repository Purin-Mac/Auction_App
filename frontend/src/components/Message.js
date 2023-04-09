import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/main.css";
import { AuthContext } from "../service/AuthContext";
import Modalimg from "./Modalimg";

export const Message = ({ chatData, anotherUserData, messages }) => {
    const { currentUser, appsPicture } = useContext(AuthContext);
    const [selectedImg, setSelectedImg] = useState(null);
    const lastMessage = useRef();

    useEffect(() => {
        lastMessage.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages]);

    return (
        <>
            {messages.map((message) => (
                <div ref={lastMessage} key={message.id} className={`Message1${message.senderEmail === currentUser.email ? "-Owner" : ""}`}>
                    <div className="MessageInfo">
                        {message.senderEmail === currentUser.email ? 
                        <img src={currentUser.photoURL} alt="userPic" onError={(e) => {e.target.onerror = null; e.target.src = appsPicture["User.png"]}}/>
                        : <img src={anotherUserData.userPhoto} alt="userPic" onError={(e) => {e.target.onerror = null; e.target.src = appsPicture["User.png"]}}/>}
                        
                        <span>
                            {message.sendTime
                                .toDate()
                                .toLocaleDateString("en-US", {
                                    dateStyle: "medium",
                        
                                })}
                            
                        </span>
                        <span>
                            {message.sendTime
                                    .toDate()
                                    .toLocaleTimeString(
                                    )}
                        </span>
                    </div>
                    <div className="MessageContent">
                        {message.message !== "" && <p>{message.message}</p>}
                        {message.messageImg && <img src={message.messageImg} alt="messagePic" onClick={() => setSelectedImg(message.messageImg)}/>}
                    </div>
                </div>
            ))}
            {selectedImg && (
                <Modalimg selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
            )}
        </>
    );
};
