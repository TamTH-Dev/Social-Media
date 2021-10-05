import Share from '../../components/share/Share'
import Post from '../../components/post/Post'
import { Posts } from '../../dummyData'

import './feed.css'

const Feed = () => {
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {Posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Feed
