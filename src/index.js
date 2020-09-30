const express = require('express')
const { body, validationResult } = require('express-validator')

const server = express()

server.use(express.json())

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
