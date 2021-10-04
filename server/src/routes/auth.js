const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/User')

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  try {
    // Generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    // Save user and respond
    const user = await newUser.save()
    res.status(200).json({
      user,
    })
  } catch (error) {
    console.error(error)
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
    console.error(error)
  }
})

module.exports = router