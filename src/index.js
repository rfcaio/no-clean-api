const express = require('express')

const server = express()

server.get('/', (req, res) => {
  res.json({ message: 'Ok.' })
})

server.listen(3000)
