import React, { useState, useEffect } from 'react';
import Message from './Message';
import TextFieldWithSubmit from './TextFieldWithSubmit';

const ChatContainer = (props) => {
  const [user, setUser] = useState({})
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [replyMessage, setReplyMessage] = useState(null)

  const getCurrentUser = async () => {
    try {
      const response = await fetch("/api/v1/users/current", {
        credentials: 'same-origin',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
      const responseBody = await response.json()
      setUser(responseBody)
    } catch (error) {
      console.error(`Error in Fetch: ${error.message}`)
    }
  }

  useEffect(() => {
    getCurrentUser()
    
    App.chatChannel = App.cable.subscriptions.create(
      // Info that is sent to the subscribed method
      {
        channel: "ChatChannel",
        chat_id: 1
        // currently this is hardcoded
        // If you had router, you could do:
        // chat_id: props.match.params["id"]
      },
      {
        connected: () => console.log("ChatChannel connected"),
        disconnected: () => console.log("ChatChannel disconnected"),
        received: data => {
          // Data broadcasted from the chat channel
          // console.log(data)
          setReplyMessage(data)
        }
      }
    );
  }, [])

  
  useEffect(() => {
    if (replyMessage){
      setMessages([...messages, replyMessage])
    }
  }, [replyMessage])

  const handleMessageReceipt = (message) => {
    setMessages([...messages, message])
  }

  const handleClearForm = () => {
    setMessage("")
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // debugger
    // Send info to the receive method on the back end
    App.chatChannel.send({
     message: message,
     user: user
    })

    // handleClearForm();
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  let messagesComponents = messages.map(message => {
    return(
      <Message
        key={message.messageId}
        handle={message.user.handle}
        icon={message.user.icon_num}
        message={message.message}
      />
    )
  }, this);

  return(
    <div>
      <div className='callout chat' id='chatWindow'>
        {messagesComponents}
      </div>
      <form onSubmit={handleFormSubmit}>
        <TextFieldWithSubmit
          content={message}
          name='message'
          handlerFunction={handleMessageChange}
        />
      </form>
    </div>
  );
}

export default ChatContainer;
