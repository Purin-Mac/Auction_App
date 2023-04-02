import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import Sidebar from "../components/Sidebar";
import ProfileForm from "../components/UserProfileForm";
import { Link } from 'react-router-dom';

const UserProfilepage = () => {
    
    return (
        <>
            <div className="paint">
            <Header/>
            <ProfileBanner/>
            <div className="Chatmain">                
            <Sidebar/>
                <div className="chat-container">
                    <ProfileForm/>
                </div>
            </div>
            <Footer/>
            </div>
        </>
    )
};

export default UserProfilepage;