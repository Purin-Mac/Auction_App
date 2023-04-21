import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import Sidebar from "../components/Sidebar";
import Delivery from "../components/Delivery";

const Deliverypage = () => {
    
    return (
        <>
            <div className="paint">
            <Header/>
            <ProfileBanner/>
            <div className="Chatmain">
                <Sidebar/>
                <div className="chat-container">
                    <Delivery/>
                </div>
            </div>
            <Footer/>
            </div>
        </>
    )
};

export default Deliverypage;