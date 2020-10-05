const express = require('express')
const { body, param, validationResult } = require('express-validator')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('product.db', error => {
  console.log(error || 'Database created.')
})

db.run(
  `
    CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL
    )
  `,
  error => error && console.log(error)
)

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
  db.all('SELECT * FROM product', (error, products) => {
    if (error) {
      return res.status(500).json({ message: 'Server error occurred.' })
    }
    return res.status(200).json({ products })
  })
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
    db.get('SELECT * FROM product WHERE id = ?', id, (error, product) => {
      if (error) {
        return res.status(500).json({ message: 'Server error occurred.' })
      }

      if (!product) {
        return res.status(404).json({ message: 'Product not found.' })
      }

      return res.status(200).json(product)
    })
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
    const query = 'INSERT INTO product (name, price) VALUES (?, ?)'
    db.run(query, [name, price], error => {
      if (error) {
        return res.status(500).json({ message: 'Server error occurred.' })
      }
      return res.status(201).json({ message: 'Product created with success.' })
    })
  }
)

server.put(
  '/product/:id',
  [
    body('name')
      .notEmpty()
      .withMessage('Product name should not be empty.')
      .isLength({ min: 6 })
      .withMessage('Product name must have at least 6 characters.'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('You must provide a valid price.'),
    param('id')
      .isInt({ gt: 0 })
      .withMessage('You must provide a valid id.')
  ],
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, price } = req.body
    const { id } = req.params
    const query = 'UPDATE product SET name = ?, price = ? WHERE id = ?'
    // FIXME: an inexistent product should not be updated
    db.run(query, [name, price, id], error => {
      if (error) {
        return res.status(500).json({ message: 'Server error occurred.' })
      }
      return res.status(200).json({ message: 'Product updated with success.' })
    })
  }
)

server.listen(3000)
