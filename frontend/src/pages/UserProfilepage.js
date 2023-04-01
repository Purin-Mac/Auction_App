import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import Sidebar from "../components/Sidebar";
import { UserProfileForm } from "../components/UserProfileForm";


const UserProfilepage = () => {
    return (
        <>
            <div className="paint">
            <Header/>
            <ProfileBanner/>
            <div className="Chatmain">                
            <Sidebar/>
                <div className="chat-container">
                    <UserProfileForm/>
                </div>
            </div>
            <Footer/>
            </div>
        </>
    )
};

export default UserProfilepage;