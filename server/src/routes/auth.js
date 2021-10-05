const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/User')

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })
    const user = await newUser.save()
    res.status(200).json({
      user,
    })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: 'Wrong password' })
    }
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router
