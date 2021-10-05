import { useState, useEffect } from 'react'

import apiService from '../../helpers/apiService'
import Share from '../../components/share/Share'
import Post from '../../components/post/Post'

import './feed.css'

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = username
          ? await apiService.get(`posts/profile/${username}`)
          : await apiService.get('posts/timeline/615b0d0aa02e4f634b680730')
        setPosts(res.data.posts)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPosts()
  }, [username])

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((post) => (
          <Post key={post._id} isProfilePage={!!username} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Feed
