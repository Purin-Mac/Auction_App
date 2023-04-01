import React from 'react'
import '../style/Profile.css'

export const UserProfileForm = () => {
  return (
    <div className='UserProfileMain'>
        <h1>Profile</h1>
        <p>Username : Thana</p>
        <p>Email Addredd : s6201012630045@gmail.com</p>
        <p>Firstname : Thanakorn</p>
        <p>Lastname : Boriboon</p>
        <p>Address : 1234 NW Bobcat Lane, St.Robert, MO 65584-5678</p>
        <p>Identity Number : 1-56xx-xxxxxx-x3-2</p>
        <p>Phone Number : 081-652-6895</p>
        <button type='submit'>Edit Your Profile</button>
    </div>
  )
}
