const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/User')

// Update user
router.put('/:id', async (req, res) => {
  if (req.body.userId !== req.params.id && !req.body.isAdmin) {
    return res
      .status(403)
      .json({ message: 'You can update only your account!' })
  }
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
  try {
    await User.findByIdAndUpdate(req.params.id, { $set: req.body })
    res.status(200).json({ message: 'Account has been updated' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Delete user
router.delete('/:id', async (req, res) => {
  if (req.body.userId !== req.params.id && !req.body.isAdmin) {
    return res
      .status(403)
      .json({ message: 'You can delete only your account!' })
  }
  try {
    await User.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: 'Account has been deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Get user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Follow user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId === req.params.id) {
    return res.status(403).json({ message: 'You cannot follow yourself' })
  }
  try {
    const followedId = req.params.id
    const followingId = req.body.userId
    const user = await User.findById(followedId)
    const currentUser = await User.findById(followingId)
    if (user.followers.includes(followingId)) {
      return res.status(403).json({ message: 'You already followed this user' })
    }
    await user.updateOne({ $push: { followers: followingId } })
    await currentUser.updateOne({ $push: { followings: followedId } })
    res.status(200).json({ message: 'User has been followed' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Unfollow user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId === req.params.id) {
    return res.status(403).json({ message: 'You cannot unfollow yourself' })
  }
  try {
    const followedId = req.params.id
    const followingId = req.body.userId
    const user = await User.findById(followedId)
    const currentUser = await User.findById(followingId)
    if (!user.followers.includes(followingId)) {
      return res.status(403).json({ message: 'You dont this user' })
    }
    await user.updateOne({ $pull: { followers: followingId } })
    await currentUser.updateOne({ $pull: { followings: followedId } })
    res.status(200).json({ message: 'User has been unfollowed' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router
