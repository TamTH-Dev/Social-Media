import { useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

import apiService from '../../helpers/apiService'
import { AuthContext } from '../../context/AuthContext'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'

import './messenger.css'

const Messenger = () => {
  const { user } = useContext(AuthContext)
  const [socket, setSocket] = useState(null)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const scrollRef = useRef()

  useEffect(() => {
    setSocket(io('ws://localhost:3002'))
  }, [])

  useEffect(() => {
    socket?.emit('addUser', user._id)
    socket?.on('getUsers', (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      )
    })
    socket?.on('getMessage', (data) => {
      const arrivalMessage = {
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      }
      if (currentChat?.members.includes(arrivalMessage.sender)) {
        setMessages((prevMessages) => [...prevMessages, arrivalMessage])
      }
    })
  }, [user, socket, currentChat])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await apiService.get(`conversations/${user._id}`)
        setConversations(res.data.conversations)
      } catch (error) {
        console.error(error)
      }
    }
    getConversations()
  }, [user._id])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiService.get(`messages/${currentChat._id}`)
        setMessages(res.data.messages)
      } catch (error) {
        console.error(error)
      }
    }
    if (currentChat?._id) {
      getMessages()
    }
  }, [currentChat])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    }
    const demo = currentChat.members.find((member) => member !== user._id)
    socket.emit('sendMessage', {
      senderId: user._id,
      receiverId: demo,
      text: newMessage,
    })
    try {
      const res = await apiService.post('messages', message)
      setMessages([...messages, res.data.message])
      setNewMessage('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              className="chatMenuInput"
              type="text"
              placeholder="Search for friends..."
            />
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => setCurrentChat(conversation)}
              >
                <Conversation conversation={conversation} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((message, index) => (
                    <div key={index} ref={scrollRef}>
                      <Message
                        message={message}
                        own={message.sender === user._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  />
                  <button onClick={handleSubmit} className="chatSubmitButton">
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user?._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger
