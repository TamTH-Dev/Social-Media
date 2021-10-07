import { useEffect, useState } from 'react'

import apiService from '../../helpers/apiService'

import './conversation.css'

const Conversations = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id)
    const getUser = async () => {
      try {
        const res = await apiService.get(`users?userId=${friendId}`)
        setUser(res.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    getUser()
  }, [currentUser, conversation])

  return (
    <div className="conversation">
      <img className="conversationImg" src={user?.profilePicture ? `${PF}${user.profilePicture}` : `${PF}person/noAvatar.png`} alt="" />
      <span className="conversationName">{user?.username}</span>
    </div>
  )
}

export default Conversations
