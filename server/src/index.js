const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const postRoutes = require('./routes/posts')

const app = express()

env.config()

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log('Connected to Atlas successfully!')
  }
)

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
