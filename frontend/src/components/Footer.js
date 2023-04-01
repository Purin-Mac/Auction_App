import '../style/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../resources/Hammer of the God.png';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
// import firebase, { signInWithGoogle } from '../service/firebase';
// import User from '../service/User';
import Profile from './Profile';

function Footer() {
    // const [user, setUser] = useState(null);
    
    // useEffect(() => {
    //   firebase.auth().onAuthStateChanged(user => {
    //   setUser(user)
    // })
    // }, []);
  
    // console.log(user);
  
    return (
    <>
    
    <div className="footer">
        <div class="container">
            <div class="row">
                <div class="column">
                    <div class="logo">
                        <h1>Let's Auct</h1>
                        <img src={logo} alt="Official logo" />
                    </div>
                    <p>Get everything you want <br/>with us</p>
                </div>
                <div class="column">
                    <h1>Categories</h1>
                    <li><a href="#">Accesssories</a></li>
                    <li><a href="#">Shoes</a></li>
                    <li><a href="#">Men's Clothes</a></li>
                    <li><a href="#">Woman's Clothes</a></li>
                </div>
                <div class="column">
                    <h1>Recommend</h1>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Shipping</a></li>
                </div>
                <div class="column">
                    <h1>Contact</h1>
                    <li><a href="#">+66 984 618 33</a></li>
                    <li><a href="#">Letsauct@example.com</a></li>
                    <ul>
                        <a href="#" class="fa fa-facebook"></a>
                        <a href="#" class="fa fa-twitter"></a>
                        <a href="#" class="fa fa-instagram"></a>                            
                    </ul>
                </div>
            </div>
            <br/>
            <br/>
        </div>
    </div>   
    </>
    );
  };
  
  export default Footer;