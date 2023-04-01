import React, { useContext } from 'react'
import '../style/main.css'
import { AuthContext } from '../service/AuthContext';


function ProfileBanner() {

  const {appsPicture} = useContext(AuthContext); 
  const {currentUser} = useContext(AuthContext)

  const styles = {
    backgroundImage: `url(${appsPicture["ProfileBan.png"]})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    /* other background styles */
  };

  return (

    <div className='ProfileBanner' style={styles}>
        <div class="about">
            {/* <img src={appsPicture["ProfileBan.png"]}/> */}
            <h1> Welcome {currentUser.displayName} !</h1>
            <img src={currentUser.photoURL} alt="profile" onError={(e) => {e.target.onerror = null; e.target.src = appsPicture["User.png"]}}/>
        </div>

    </div>
  )
}

export default ProfileBanner