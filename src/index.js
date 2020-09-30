const express = require('express')

const server = express()

server.use(express.json())

server.post('/product', (req, res) => {
  const { name, price } = req.body
  return res.status(201).json({
    message: `Product ${name} with price ${price} created with success.`
  })
})

server.listen(3000)
