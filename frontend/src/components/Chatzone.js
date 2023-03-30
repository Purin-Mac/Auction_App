import React from 'react'
import '../style/main.css';
import { ChatInput } from './ChatInput';
import { Message2 } from './Message2';


export const Chatzone = () => {
  return (
    <div className='Chatzone'>
        <Message2/>
        <ChatInput/>
    </div>
  )
}
