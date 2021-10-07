import { useEffect, useState } from 'react'

import apiService from '../../helpers/apiService'

import './chatOnline.css'

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await apiService.get(`users/friends/${currentId}`)
        setFriends(res.data.friends)
      } catch (error) {
        console.error(error)
      }
    }
    getFriends()
  }, [currentId])

  useEffect(() => {
    setOnlineFriends(
      friends.filter((friend) => onlineUsers.includes(friend._id))
    )
  }, [friends, onlineUsers])

  const handleClick = async (user) => {
    try {
      const res = await apiService.get(`conversations/find/${currentId}/${user._id}`)
      setCurrentChat(res.data.conversation)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="chatOnline">
      {onlineFriends?.map((onlineFriend) => (
        <div
          key={onlineFriend._id}
          className="chatOnlineFriend"
          onClick={() => handleClick(onlineFriend)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                onlineFriend.profilePicture
                  ? `${PF}${onlineFriend.profilePicture}`
                  : `${PF}person/noAvatar.png`
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{onlineFriend.username}</span>
        </div>
      ))}
    </div>
  )
}

export default ChatOnline
