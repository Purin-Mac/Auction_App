import React, { useContext } from 'react'
import '../style/main.css'
import { AuthContext } from '../service/AuthContext';


function ProfileBanner() {

  const { appsPicture, categoryIDs } = useContext(AuthContext); 
  const {currentUser} = useContext(AuthContext)

  return (

    <div className='ProfileBanner'>
        <div class="about">
            {/* <img src={appsPicture["BG-Banner.png"]}/> */}
            <h1> Welcome {currentUser.displayName} !</h1>
            <img src={currentUser.photoURL}/>
        </div>

    </div>
  )
}

export default ProfileBanner