const router = require('express').Router()

const Message = require('../models/Message')

// Add new message
router.post('/', async (req, res) => {
  const newMessage = new Message(req.body)
  try {
    const message = await newMessage.save()
    res.status(201).json({ message })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// Get a messages
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
    res.status(200).json({ messages })
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router
