import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import Sidebar from "../components/Sidebar";
import ProfileForm from "../components/UserProfileForm";
import Delivery from "../components/Delivery";

const Shippingpage = () => {
    
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

export default Shippingpage;