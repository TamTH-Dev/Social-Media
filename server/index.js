const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')

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

app.get('/', (req, res) => {
  res.send('Hello world')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
