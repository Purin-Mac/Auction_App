import React, { useState } from "react";
import "../style/main.css";
import { ChatInput } from "./ChatInput";
import { Messages } from "./Messages";

export const Chatzone = () => {
  const [imgPreview, setImgPreview] = useState(null);

    return (
        <div className="Chatzone">
            <Messages imgPreview={imgPreview}/>
            <ChatInput setImgPreview={setImgPreview}/>
        </div>
    );
};
