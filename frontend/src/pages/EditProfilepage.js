import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import Sidebar from "../components/Sidebar";
import EditProfile from "../components/EditProfile";


const EditProfilepage = () => {

    return (
        <>
            <div className="paint">
            <Header/>
            <ProfileBanner/>
            <div className="Chatmain">                
            <Sidebar/>
                <div className="chat-container">
                    <EditProfile/>

                </div>
            </div>
            <Footer/>
            </div>
        </>
    )
};

export default EditProfilepage;