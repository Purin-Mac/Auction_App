import React, { useContext } from 'react'
import '../style/main.css'
import { AuthContext } from '../service/AuthContext';

function Banner() {
    // const [user, setUser] = useState(null);
    
    // useEffect(() => {
    //   firebase.auth().onAuthStateChanged(user => {
    //   setUser(user)
    // })
    // }, []);
  
    // console.log(user);
    
    const {appsPicture} = useContext(AuthContext); 
    const styles = {
        backgroundImage: `url(${appsPicture["BG-Banner.png"]})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        /* other background styles */
      };

    return (
    <>
    
    <div class="banner" style={styles}>
                <div class="info">
                    <h1>“Get what ever you want” <br/> With us Let’s Auct !</h1>                    
                </div>
                <div class="banner-button">
                    <a href="#">Get Start</a>
                </div>
            </div>
      </>
    );
  };
  
  export default Banner;