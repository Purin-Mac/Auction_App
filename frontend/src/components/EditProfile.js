import React, { useContext, useRef } from 'react'
import { AuthContext } from '../service/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../style/Profile.css';
import { db } from "../service/firebase";
import { doc, updateDoc } from 'firebase/firestore';

function EditProfile() {

    const { userData, updateUserData } = useContext(AuthContext);
    const navigate = useNavigate();

    const firstName = useRef();
    const lastName = useRef();
    const city = useRef();
    const state = useRef();
    const street = useRef();
    const zip = useRef();
    const numberID = useRef();
    const phoneNumber = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userRef = doc(db, "Users", userData.id);
        
        const updatedUserData = {
            firstName: firstName.current.value || null,
            lastName: lastName.current.value || null,
            address: {
                city: city.current.value || null,
                state: state.current.value || null,
                street: street.current.value || null,
                zip: zip.current.value || null,
            },
            numberID: numberID.current.value || null,
            phoneNumber: phoneNumber.current.value || null,
       
        };
        updateDoc(userRef, updatedUserData).then(() => {
            updateUserData(userData.id);
            navigate("/profile");
            // console.log("Update successful!");
        }).catch((error) => {
            navigate("/profile");
            // console.error("Error updating document: ", error);
        });
    };
      
  return (
        <div className='UserProfileMain'>
            <div className='EditProfile'>
                <div className='UserInfo'>
                    <h2>Edit Your Profile</h2>
                    {/* <p>Firstname : {userData.firstName}</p>
                    <p>Lastname : {userData.lastName}</p>
                    <p>Address : {userData.address.street}, {userData.address.city}, {userData.address.state}, {userData.address.zip}</p>
                    <p>Identity Number : {userData.numberID}</p>
                    <p>Phone Number : {userData.phoneNumber}</p> */}
                    {/* <button type='submit'>Save your profile</button> */}
                    <form onSubmit={handleSubmit}>

                        <label className='Firstname'>
                            Firstname : 
                            <input type="text" ref={firstName} placeholder={userData.firstName}></input>
                        </label><br></br><br></br>

                        <label className='Lastname'>
                            Lastname : 
                            <input type="text" ref={lastName} placeholder={userData.lastName}/>
                        </label><br></br><br></br>

                        <label className='Street'>
                            Street : 
                            <input type="text" ref={street} placeholder={userData.address.street}/>
                        </label>

                        <label className='City'>
                            City : 
                            <input type="text" ref={city} placeholder={userData.address.city}/>
                        </label><br></br><br></br>

                        <label className='State'>
                            State : 
                            <input type="text" ref={state} placeholder={userData.address.state}/>
                        </label>

                        <label className='Zip'>
                            Zip : 
                            <input type="text" ref={zip} minLength="5" maxLength="5" placeholder={userData.address.zip}/>
                        </label><br></br><br></br>

                        <label className='Identity'>
                            Identity Number : 
                            <input type="text" ref={numberID} minLength="13" maxLength="13" placeholder={userData.numberID}/>
                        </label><br></br><br></br>

                        <label className='Phone'>
                            Phone Number : 
                            <input type="text" ref={phoneNumber} minLength="10" maxLength="10" placeholder={userData.phoneNumber}/>
                        </label><br></br><br></br>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>  
        </div>

  )
}

export default EditProfile
