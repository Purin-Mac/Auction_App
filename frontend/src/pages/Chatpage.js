import React from "react";
import { Chat1, Chatzone } from "../components/Chatzone";
import { ChatSidebar1 } from "../components/ChatSidebar1";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProfileBanner from "../components/ProfileBanner";
import "../style/chat.css";


const Chatpage = () => {
    return (
        <>
            <div className="paint">
            <div className="chatpage">
            <Header/>
            <ProfileBanner/>
            <div className="Chatmain">
            <Sidebar/>
                <div className="chat-container">
                    <ChatSidebar1/>
                    <Chatzone/>
                </div>
            </div>
            <Footer/>
            </div>
            </div>
        </>
    )
};

export default Chatpage;
