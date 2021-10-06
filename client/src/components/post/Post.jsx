import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { MoreVert } from '@material-ui/icons'
import { format } from 'timeago.js'

import apiService from '../../helpers/apiService'
import { AuthContext } from '../../context/AuthContext'

import './post.css'

const Post = ({ post, isProfilePage }) => {
  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState({})
  const { user: currentUser } = useContext(AuthContext)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiService.get(`users?userId=${post.userId}`)
        setUser(res.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUser()
  }, [post.userId])

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id))
  }, [post.likes, currentUser._id])

  const likeHandler = async () => {
    try {
      await apiService.put(`posts/${post._id}/react`, {
        userId: currentUser._id,
      })
      setLike((like) => (isLiked ? like - 1 : like + 1))
      setIsLiked((isLiked) => !isLiked)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link
              style={{ textDecoration: 'none', color: 'gray' }}
              className="postTopLeftLink"
              to={!isProfilePage ? `profile/${user.username}` : '#'}
            >
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? `${PF}${user.profilePicture}`
                    : `${PF}person/noAvatar.png`
                }
                alt=""
              />
              <span className="postUsername">{user.username}</span>
            </Link>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={`${PF}${post.img}`} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}/like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}/heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
