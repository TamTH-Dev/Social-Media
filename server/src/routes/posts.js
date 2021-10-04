const router = require('express').Router()

const Post = require('../models/Post')
const User = require('../models/User')

// Create a post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(201).json({ savedPost })
  } catch (error) {
    res.status(500).status({ error })
  }
})

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId !== req.body.userId) {
      return res.status(403).json({ message: 'You can update only your post' })
    }
    await post.updateOne({ $set: req.body })
    res.status(200).json({ message: 'The post has been updated' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId !== req.body.userId) {
      return res.status(403).json({ message: 'You can delete only your post' })
    }
    await post.deleteOne()
    res.status(200).json({ message: 'The post has been deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Like/Dislike a post
router.put('/:id/react', async (req, res) => {
  try {
    const userId = req.body.userId
    const post = await Post.findById(req.params.id)
    // If user already liked a post, dislike it
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } })
      return res.status(200).json({ message: 'The post has been disliked' })
    }
    await post.updateOne({ $push: { likes: userId } })
    res.status(200).json({ message: 'The post has been liked' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Get timeline posts
router.get('/timeline', async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId)
    const userPosts = await Post.find({ userId: currentUser._id })
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => Post.find({ userId: friendId }))
    )
    res.status(200).json({ posts: [...userPosts, ...friendPosts] })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

// Get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json({ post })
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router
