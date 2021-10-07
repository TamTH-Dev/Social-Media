const io = require('socket.io')(3002, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

let users = []

const addUser = (userId, socketId) =>
  !users.some((user) => user.userId === userId) &&
  users.push({ userId, socketId })

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => users.find((user) => user.userId === userId)

io.on('connection', (socket) => {
  // Add just connected user 
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id)
    io.emit('getUsers', users)
  })

  // Send message to friend
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId)
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
      })
    }
  })

  // Handle disconnection from user
  socket.on('disconnect', () => {
    removeUser(socket.id)
    io.emit('getUsers', users)
  })
})
