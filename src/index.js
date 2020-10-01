const express = require('express')
const { body, param, validationResult } = require('express-validator')

const server = express()

server.use(express.json())

server.delete(
  '/product/:id',
  [
    param('id')
      .isInt({ gt: 0 })
      .withMessage('You must provide a valid id.')
  ],
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    return res.status(204).end()
  }
)

server.get('/product', (req, res) => {
  return res.status(200).json({ products: [] })
})

server.get(
  '/product/:id',
  [
    param('id')
      .isInt({ gt: 0 })
      .withMessage('You must provide a valid id.')
  ],
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    return res.status(200).json({ id })
  }
)

server.post(
  '/product',
  [
    body('name')
      .notEmpty()
      .withMessage('Product name should not be empty.')
      .isLength({ min: 6 })
      .withMessage('Product name must have at least 6 characters.'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('You must provide a valid price.')
  ],
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, price } = req.body
    return res.status(201).json({
      message: `Product ${name} with price ${price} created with success.`
    })
  }
)

server.listen(3000)
