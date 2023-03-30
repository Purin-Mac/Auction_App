import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../service/AuthContext";
import '../style/main.css';

const Sidebar = () => {
    const { signOUT } = useContext(AuthContext)

    return (
        <div className="sidebar">
                <li><a><Link to="/profile">Profile</Link></a></li>
                <li><a><Link to="/buying_history">Buying</Link></a></li>
                <li><a><Link to="/selling_history">Selling</Link></a></li>
                <li><a><Link to="/messager">Messager</Link></a></li>
                <li><a><Link onClick={() => signOUT()}>Sign out</Link></a></li>
        </div>
    );
};

export default Sidebar;
