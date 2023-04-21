import React, { useContext } from 'react'
import '../style/main.css'
import { AuthContext } from '../service/AuthContext';

function Banner() {

    
    const {appsPicture} = useContext(AuthContext); 
    const styles = {
        backgroundImage: `url(${appsPicture["BG-Banner.png"]})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        /* other background styles */
      };

    return (
    <>
    
            <div className="banner" style={styles}>
                <div className="info">
                    <h1>“Get what ever you <span class="highlight">want</span>” <br/> With us Let’s Auct !</h1>                    
                </div>
                <div className="banner-button">
                    <a>Get Start</a>
                </div>
            </div>
      </>
    );
  };
  
  export default Banner;