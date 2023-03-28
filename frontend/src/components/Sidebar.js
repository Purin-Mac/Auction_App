import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../service/AuthContext";

const Sidebar = () => {
    const { signOUT } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <Link to="/profile">Profile</Link>
            <Link to="/buying_history">Buying</Link>
            <Link to="/profile">Selling</Link>
            <Link to="/messager">Messager</Link>
            <Link onClick={() => signOUT()}>Sign out</Link>
        </div>
    );
};

export default Sidebar;
