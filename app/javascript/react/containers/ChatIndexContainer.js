import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

const ChatIndexContainer = props => {
  const [chatRooms, setChatRooms] = useState([])

  useEffect(() => {
    fetch("/api/v1/chats", {
      credentials: 'same-origin',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => {
      let { ok } = response;
      if (ok) {
        return response.json();
      }
    })
    .then((chats) => {
      setChatRooms(chats)
    })
  }, [])

  let chatLinks = chatRooms.map((room) => {
    let name = room.title

    if (!name) {
      name = "untitled"
    }

    return(
      <Link key={room.id} to={`/chats/${room.id}`} >
        <li>
          {name}
        </li>
      </Link>
    )
  })

  return(
    <div>
      <h1>Chat Rooms</h1>
      <ul>
        {chatLinks}
      </ul>
    </div>
  )
}

export default ChatIndexContainer
