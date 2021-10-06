import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Add } from '@material-ui/icons'

import apiService from '../../helpers/apiService'
import { AuthContext } from '../../context/AuthContext'
import { Follow, Unfollow } from '../../context/AuthActions'
import Online from '../../components/online/Online'
import { Users } from '../../dummyData'

import './rightbar.css'

const Rightbar = ({ user }) => {
  const { user: currentUser, dispatch } = useContext(AuthContext)
  const [friends, setFriends] = useState([])
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  )
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await apiService.get(`users/friends/${user._id}`)
        setFriends(res.data.friends)
      } catch (error) {
        console.error(error)
      }
    }
    if (user?._id) {
      fetchFriends()
    }
  }, [user])

  const handleClick = async () => {
    try {
      const userId = user._id
      const currentUserId = currentUser._id
      if (followed) {
        await apiService.put(`users/${userId}/unfollow`, {
          userId: currentUserId,
        })
        dispatch(Follow(userId))
      } else {
        await apiService.put(`users/${userId}/follow`, {
          userId: currentUserId,
        })
        dispatch(Unfollow(userId))
      }
      setFollowed((followed) => !followed)
    } catch (error) {
      console.error(error)
    }
  }

  const HomeRightbar = () => (
    <>
      <div className="birthdayContainer">
        <img className="birthdayImg" src="/assets/gift.png" alt="" />
        <span className="birthdayText">
          <b>Pola Forter</b> and <b>3 other friends</b> have a birthday today
        </span>
      </div>
      <img className="rightbarAd" src="/assets/ad.png" alt="" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {Users.map((user) => (
          <Online key={user.id} user={user} />
        ))}
      </ul>
    </>
  )

  const ProfileRightbar = () => (
    <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? (
            <span>Unfollow</span>
          ) : (
            <>
              <Add />
              <span>Follow</span>
            </>
          )}
        </button>
      )}
      <h4 className="rightbarTitle">User information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City:</span>
          <span className="rightbarInfoValue">{user.city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">From:</span>
          <span className="rightbarInfoValue">{user.from}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship:</span>
          <span className="rightbarInfoValue">
            {user.relationship === 1
              ? 'Single'
              : user.relationship === 2
              ? 'Married'
              : '-'}
          </span>
        </div>
      </div>
      <h4 className="rightbarTitle">User friends</h4>
      <div className="rightbarFollowings">
        {friends?.length > 0 &&
          friends.map((friend) => (
            <Link
              key={friend._id}
              style={{ textDecoration: 'none', color: '#333' }}
              to={`/profile/${friend.username}`}
            >
              <div className="rightbarFollowing">
                <img
                  className="rightbarFollowingImg"
                  src={
                    friend.profilePicture
                      ? `${PF}${friend.profilePicture}`
                      : `${PF}person/noAvatar.png`
                  }
                  alt=""
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
      </div>
    </>
  )

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  )
}

export default Rightbar
