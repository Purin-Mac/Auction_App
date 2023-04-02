import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../service/AuthContext";
import '../style/main.css';

const Sidebar = () => {
    const { signOUT } = useContext(AuthContext)

    return (
        <div className="sidebar">
                <li><Link className="sidebar-text" to="/profile">Profile</Link></li>
                <li><Link className="sidebar-text" to="/buying_history">Buying</Link></li>
                <li><Link className="sidebar-text" to="/selling_history">Selling</Link></li>
                <li><Link className="sidebar-text" to="/messager">Messager</Link></li>
                <li><Link className="sidebar-text" onClick={() => signOUT()}>Sign out</Link></li>
        </div>
    );
};

export default Sidebar;
