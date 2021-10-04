const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('Here is user root')
})

module.exports = router
