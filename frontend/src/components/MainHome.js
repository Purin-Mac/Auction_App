import '../style/main.css';
import Shoes from '../resources/Sneaker2.png';
import MenClothes from '../resources/Bronx Hoodie.png';
import Jacket from '../resources/Diesel.png';
import AirMax from '../resources/Airjordan.png'
import { useContext } from 'react';
import { AuthContext } from '../service/AuthContext';
import { Card, CardGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function MainHome( {link} ) {
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
        <div class="reccommend">
            <h1>Our Recommend</h1>
            <p>Explore categories that we recommend.</p>
            <CardGroup style={{ margin: "5% auto 0 auto", width: "80%", display: "flex", justifyContent: "space-between" }}>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Shoes.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Shoes", categoryID: categoryIDs["Shoes"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Shoes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Men clothes.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Men's clothes", categoryID: categoryIDs["Men's clothes"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Men's clothes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Women clothes.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Women's clothes", categoryID: categoryIDs["Women's clothes"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Women's clothes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Accessories.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Accessories", categoryID: categoryIDs["Accessories"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Accessories</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
            </CardGroup>
        </div>
        <div class="discover">
            <h1>Discover</h1>
            <div class="cards">
                <div class="row">
                    <div class="column">
                        <div class="card">
                            <img src={Shoes} alt="Shoes" /> 
                            <div className='bottomcard'>
                            <h3>Nike Air Max 90</h3>
                            <p>2000 THB</p>
                            </div>
                        </div>
                    </div>
                
                    <div class="column">
                        <div class="card">
                            <img src={Jacket} alt="Shoes" /> 
                            <div className='bottomcard'>
                            <h3>Jacket Rush Harrington </h3>
                            <p>955 THB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src={MenClothes} alt="Shoes" /> 
                            <div className='bottomcard'>
                            <h3>Bronx Hoodie</h3>
                            <p>963 THB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
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
        <div class="main-advertise">
            <h1>Advertise</h1>
            {/* <img src={Advertise} alt="Advertise" />  */}
        </div>
    </section>

      </>
    );
  };
  
  export default MainHome;