import React, { useState, useEffect } from 'react';
import Message from '../components/Message';
import TextFieldWithSubmit from '../components/TextFieldWithSubmit';

const ChatContainer = (props) => {
  const [user, setUser] = useState({})
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")


  // useEffect(() => {
  //   fetch("/api/v1/users/current", {
  //     credentials: 'same-origin',
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  //   .then((response) => {
  //     let { ok } = response;
  //     if (ok) {
  //       return response.json();
  //     }
  //   })
  //   .then((data) => {
  //     setUser(data)
  //   })
  //
  //   App.chatChannel = App.cable.subscriptions.create(
  //     // Info that is sent to the subscribed method
  //     {
  //       channel: "ChatChannel",
  //       chat_id: 1
  //       // currently this is hardcoded
  //       // If you had router, you could do:
  //       // chat_id: props.match.params["id"]
  //     },
  //     {
  //       connected: () => console.log("ChatChannel connected"),
  //       disconnected: () => console.log("ChatChannel disconnected"),
  //       received: data => {
  //         // Data broadcasted from the chat channel
  //         console.log(data)
  //         handleMessageReceipt(data)
  //       }
  //     }
  //   );
  // }, [])

  useEffect(() => {
    let id = props.match.params["id"]
    // debugger
    fetch(`/api/v1/chats/${id}`, {
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
    .then((data) => {
      // debugger
      setUser(data.user)
      setMessages(data.messages)
    })
  }, [])


  const handleMessageReceipt = (message) => {
    setMessages([...messages, message])
  }

  const handleClearForm = () => {
    setMessage("")
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // debugger
    let messagePayload = {
       message: message,
       user: user,
       chatId: props.match.params.id
      }

    fetch(`/api/v1/messages`, {
      credentials: "same-origin",
      method: 'POST',
      body: JSON.stringify(messagePayload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        let errorMessage = `${response.status} (${response.statusText})`,
         error = new Error(errorMessage);
        throw(error);
      }
    })
    .then(response => response.json())
    .then(body => {
      handleMessageReceipt(body)
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))

    handleClearForm();
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  let messagesComponents = messages.map(message => {
    return(
      <Message
        key={message.message.messageId}
        handle={message.user.handle}
        icon={message.user.icon_num}
        message={message.message.body}
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
