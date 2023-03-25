import '../style/main.css';
import Shoes from '../resources/Sneaker2.png';
import MenClothes from '../resources/Bronx Hoodie.png';
import Jacket from '../resources/Diesel.png';
import AirMax from '../resources/Airjordan.png'
import { useContext } from 'react';
import { AuthContext } from '../service/AuthContext';

function MainHome() {
    // const [user, setUser] = useState(null);
    
    // useEffect(() => {
    //   firebase.auth().onAuthStateChanged(user => {
    //   setUser(user)
    // })
    // }, []);
  
    // console.log(user);

    const { appsPicture } = useContext(AuthContext); 
  
    return (
    <>
    
    <main>
        <div class="reccommend">
            <h1>Our Recommend</h1>
            <p>Explore categories that we recommend.</p>
            <div class="cards">
                <div class="row">
                    <div class="column">
                        <div class="card">
                            <img src={appsPicture["Accessories.png"]} alt="Accessories" />  
                            <h3>Accesssories</h3>
                        </div>
                    </div>
                
                    <div class="column">
                        <div class="card">
                            <img src={appsPicture["Shoes.png"]} alt="Shoes" />  
                            <h3>Shoes</h3>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src={appsPicture["Men clothes.png"]} alt="MenClothes" />  
                            <h3>Men's Clothes</h3>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src={appsPicture["Women clothes.png"]} alt="WomenClothes" />  
                            <h3>Woman's Clothes</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="discover">
            <h1>Discover</h1>
            <div class="cards">
                <div class="row">
                    <div class="column">
                        <div class="card">
                            <img src={Shoes} alt="Shoes" /> 
                            <h3>Nike Air Max 90</h3>
                            <p>2000 THB</p>
                        </div>
                    </div>
                
                    <div class="column">
                        <div class="card">
                            <img src={Jacket} alt="Shoes" /> 
                            <h3>Jacket Rush Harrington </h3>
                            <p>955 THB</p>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src={MenClothes} alt="Shoes" /> 
                            <h3>Bronx Hoodie</h3>
                            <p>963 THB</p>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src={AirMax} alt="Shoes" /> 
                            <h3>Nike Airjordan</h3>
                            <p>1500 THB</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <section>
        <div class="main-advertise">
            <h1>Advertise</h1>
            {/* <img src={Advertise} alt="Advertise" />  */}
        </div>
    </section>

      </>
    );
  };
  
  export default MainHome;