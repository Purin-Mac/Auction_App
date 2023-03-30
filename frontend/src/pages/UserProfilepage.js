import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import Sidebar from "../components/Sidebar";

const UserProfilepage = () => {
    return (
        <>
            <Header/>
            <ProfileBanner/>
            <Sidebar/>
            
            <Footer/>
        </>
    )
};

export default UserProfilepage;