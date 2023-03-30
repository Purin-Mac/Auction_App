import React from "react";
import { Chat1, Chatzone } from "../components/Chatzone";
import { ChatSidebar1 } from "../components/ChatSidebar1";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProfileBanner from "../components/ProfileBanner";

const Chatpage = () => {
    return (
        <>
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

        </>
    )
};

export default Chatpage;
