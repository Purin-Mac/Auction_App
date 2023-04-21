import '../style/footer.css';
import logo from '../resources/Hammer of the God.png';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

function Footer() {

    return (
    <>
    
    <div className="footer">
        <div className="container">
            <div className="row">
                <div className="column">
                    <div className='footer-logo'>
                    <div className="logo">
                        <h1>Let's Auct</h1>
                        <img src={logo} alt="Official logo" />
                    </div>
                    <p>Get everything you want with us</p>
                    </div>
                </div>
                <div className="column">
                    <div className='footer-category'>
                    <h1>Categories</h1>
                    <li><a>Accesssories</a></li>
                    <li><a>Shoes</a></li>
                    <li><a>Men's Clothes</a></li>
                    <li><a>Woman's Clothes</a></li>
                    </div>
                </div>
                <div className="column">
                    <div className='footer-recommend'>
                    <h1>Recommend</h1>
                    <li><a>FAQ</a></li>
                    <li><a>Privacy</a></li>
                    <li><a>Shipping</a></li>
                    </div>
                </div>
                <div className="column">
                <div className='footer-contact'>
                    <h1>Contact</h1>
                    <li><a>+66 984 618 33</a></li>
                    <li><a>Letsauct@example.com</a></li>
                    <ul>
                        <a className="fa fa-facebook"></a>
                        <a className="fa fa-twitter"></a>
                        <a className="fa fa-instagram"></a>                            
                    </ul>
                    </div>
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