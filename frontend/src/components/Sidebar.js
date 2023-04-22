import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../service/AuthContext";
import '../style/main.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping, faStore, faMessage, faArrowRightFromBracket, faBoxesPacking } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
    const { signOUT } = useContext(AuthContext)

    return (
        <div className="sidebar">
                <Link className="sidebar-text" to="/profile"><li><FontAwesomeIcon className="fa" icon={faUser} size="lg"/> <span>Profile</span></li></Link>
                <Link className="sidebar-text" to="/buying_history"><li><FontAwesomeIcon className="fa" icon={faCartShopping} size="lg"/> <span>Buying</span></li></Link>
                <Link className="sidebar-text" to="/selling_history"><li><FontAwesomeIcon className="fa" icon={faStore} size="lg"/> <span>Selling</span></li></Link>
                {/* <Link className="sidebar-text" to="/delivery"><li><FontAwesomeIcon className="fa" icon={faBoxesPacking} size="lg"/> <span>Shipping</span></li></Link> */}
                <Link className="sidebar-text" to="/messager"><li><FontAwesomeIcon className="fa" icon={faMessage} size="lg"/> <span>Messager</span></li></Link>
                <Link className="sidebar-text" onClick={() => signOUT()}><li><FontAwesomeIcon className="fa" icon={faArrowRightFromBracket} size="lg"/> <span>Sign out</span></li></Link>
        </div>
    );
};

export default Sidebar;