import { useState, useEffect, useContext } from 'react'

import apiService from '../../helpers/apiService'
import { AuthContext } from '../../context/AuthContext'
import Share from '../../components/share/Share'
import Post from '../../components/post/Post'

import './feed.css'

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = username
          ? await apiService.get(`posts/profile/${username}`)
          : await apiService.get(`posts/timeline/${user._id}`)
        setPosts(res.data.posts)
      } catch (error) {
        console.error(error)
      }
    }
    if (username || user?._id) {
      fetchPosts()
    }
  }, [username, user._id])

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || user?.username === username) && <Share />}
        {posts?.length > 0 &&
          posts.map((post) => (
            <Post key={post._id} isProfilePage={!!username} post={post} />
          ))}
      </div>
    </div>
  )
}

export default Feed
