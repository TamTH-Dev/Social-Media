const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const postRoutes = require('./routes/posts')
const conversationRoutes = require('./routes/conversations')
const messageRoutes = require('./routes/messages')

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

// Cors configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

// Public
app.use('/images', express.static(path.join(__dirname, '..', 'public/images')))

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// File handler
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, '..', 'public/images/post'))
  },
  filename: (req, _, cb) => {
    cb(null, req.body.name)
  },
})
const upload = multer({ storage })
app.post('/api/upload', upload.single('file'), (_, res) => {
  try {
    res.status(200).json({ message: 'File uploaded successfully' })
  } catch (error) {
    console.log(error)
  }
})

// API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/messages', messageRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
