import React, { useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../service/firebase';
import { AuthContext } from '../service/AuthContext';
import '../style/main.css';


export const ChatSearch = () => {

  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)

  const handleSearch = async ()=>{
    const q = query(
      collection(db, "Users"),
      where("userName", "==", username)
    );

    try{
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUser(doc.data())
    });
    }catch(err){
      setErr(true)
    }
  };
  
  const handleKey = e=>{
    e.code === "Enter" && handleSearch();
  };

  return (
    <div className='Chatsearching'>

        <div className='searchForm'>
            <input type="text" 
            placeholder='Find a user' 
            onKeyDown={handleKey} 
            onChange={e=>setUsername(e.target.value)}/>
        </div>
        {err && <span>User not found!</span>}
        {user && <div className='userChat'>
          <img src={user.photoURL}/>

          <div className='userChatInfo'>
              <span>{user.userName}</span>
          </div>

        </div>}

    </div>
  )
}
