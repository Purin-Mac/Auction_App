import React from 'react'
import '../style/main.css';
import { Chatnavbar } from './Chatnavbar';
import { ChatSearch } from './ChatSearch';
import { Chats } from './Chats';

export const ChatSidebar1 = () => {
  return (
    <div className='Chatsidebar'>
      {/* <Chatnavbar/> */}
      <ChatSearch/>
      <Chats/>
    </div>
  )
}
