import '../style/main.css';
import Shoes from '../resources/Sneaker2.png';
import MenClothes from '../resources/Bronx Hoodie.png';
import Jacket from '../resources/Diesel.png';
import AirMax from '../resources/Airjordan.png'
import { useContext } from 'react';
import { AuthContext } from '../service/AuthContext';
import { Card, CardGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Category from './Category';


function MainHome() {
    // const [user, setUser] = useState(null);
    
    // useEffect(() => {
    //   firebase.auth().onAuthStateChanged(user => {
    //   setUser(user)
    // })
    // }, []);
  
    // console.log(user);
    
    const { appsPicture, categoryIDs } = useContext(AuthContext);
    return (
    <>
    
    <main>
        <div className="reccommend">
            <h1>Our Recommend</h1>
            <p>Explore categories that we recommend.</p>
            <Category link={"/category_product"}/>
        </div>
        <div className="discover">
            <h1>Discover</h1>
            <div className="cards">
                <div className="row">
                    <div className="column">
                        <div className="card">
                            <img src={Shoes} alt="Shoes" /> 
                            <div className='bottomcard'>
                            <h3>Nike Air Max 90</h3>
                            <p>2000 THB</p>
                            </div>
                        </div>
                    </div>
                
                    <div className="column">
                        <div className="card">
                            <img src={Jacket} alt="Shoes" /> 
                            <div className='bottomcard'>
                            <h3>Jacket Rush Harrington </h3>
                            <p>955 THB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="column">
                        <div className="card">
                            <img src={MenClothes} alt="Shoes" /> 
                            <div className='bottomcard'>
                            <h3>Bronx Hoodie</h3>
                            <p>963 THB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="column">
                        <div className="card">
                            <img src={AirMax} alt="Shoes" /> 
                            <div className='bottomcard'>
                            <h3>Nike Airjordan</h3>
                            <p>1500 THB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <section>
        <div className="main-advertise">
            <h1>Advertise</h1>
            {/* <img src={Advertise} alt="Advertise" />  */}
        </div>
    </section>

      </>
    );
  };
  
  export default MainHome;