import React, { useContext } from 'react'
import { AuthContext } from '../service/AuthContext';
import '../style/main.css';


export const Chatnavbar = () => {

  const {currentUser} = useContext(AuthContext)

  return (

    <div className='Chatnavbar'>

      <span className='logo'>Let's Auct</span>

      <div className='user'>

        <img src={currentUser.photoURL} alt=''/>
        <span>{currentUser.displayName}</span>
        
      </div>

    </div>

  )
}
