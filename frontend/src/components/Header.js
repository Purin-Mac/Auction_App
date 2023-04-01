import { useContext, useState } from 'react';
import "../style/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import logo from "../resources/Hammer of the God.png";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../service/AuthContext';
// import firebase, { signInWithGoogle } from '../service/firebase';
// import User from '../service/User';
import Profile from "./Profile";


const Header = () => {
    const { appsPicture } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [toggleSearch, setToggleSearch] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate(`/search?q=${searchTerm}`);
    };

    const handleSearchIconClick = () => {
        if (toggleSearch) {
            setToggleSearch(false);
            setSearchTerm('')
        }
        else {
            setToggleSearch(true);
        }
    };

    return (
        <>
            <div className="header">
                <div className="slot">
                    <Link className="logo" to="/">
                        Let's Auct <img src={appsPicture["Logo.png"]} alt="Official logo" />
                    </Link>
                </div>

                <div className="slot">
                    <div className="navbar">
                        <Link to="/">Home</Link>
                        <Link to="/category">Categories</Link>
                        <Link to="/sell">Sell</Link>
                        <a href="/">Contact</a>
                    </div>
                </div>

                <div className="slot">
                    <div className={`search-bar ${toggleSearch ? 'expanded' : 'collapsed'}`}>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search"
                                disabled={!toggleSearch}
                            ></input>
                            {/* <button type="submit">Search</button> */}
                        </form>
                        {toggleSearch ? <FontAwesomeIcon className="fa" icon={faX} onClick={handleSearchIconClick}/>
                        : <FontAwesomeIcon className="fa" icon={faMagnifyingGlass} onClick={handleSearchIconClick}/>}
                    </div>
                    {/* {toggleSearch ? (
                        <form onSubmit={handleSearchSubmit}>
                            <input type="text" value={searchTerm} onChange={handleSearchChange}></input>
                            <button type="submit" onClick={handleSearchSubmit}>Search</button>
                        </form>
                    ) : (
                        <FontAwesomeIcon icon={faMagnifyingGlass} onClick={handleSearchIconClick}/>
                    )} */}
                </div>

                <div className="slot">
                    <Profile />
                    {/* {user? user.photoURL && user.displayName : <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button>} */}
                    {/* <button className="SignIn" id="SignIn" onClick={signInWithGoogle}>Sign in with google</button> */}
                </div>
            </div>
        </>
    );
}

export default Header;
