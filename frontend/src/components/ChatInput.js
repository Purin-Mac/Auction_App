import React from 'react'
import '../style/main.css';


export const ChatInput = () => {
  return (
    <div className='ChatInput'>
      <input type="text" placeholder='Type Something'/>
      <div className='send'>
        <input type='file' style={{display:"none"}} id="file"/>
        <label htmlFor='file'>
          <img src="https://static.thenounproject.com/png/59103-200.png" alt=""/>
        </label>
        <button>Send</button>

      </div>
    </div>
  )
}
