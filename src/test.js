const request = require('supertest')

const { db, server } = require('.')

const insertDefaultProduct = done => {
  const id = '5e392019-3d9a-463f-a5cd-a7e7e631be1c'
  const name = 'Arroz Alteza 1Kg'
  const price = 6.49

  const INSERT_DEFAULT_PRODUCT_QUERY = (
    'INSERT INTO product (id, name, price) VALUES (?, ?, ?)'
  )

  db.run(INSERT_DEFAULT_PRODUCT_QUERY, [id, name, price], error => {
    if (!error) {
      done()
    }
  })
}

const truncateProductDatabase = done => {
  db.run('DELETE FROM product', error => {
    if (!error) {
      done()
    }
  })
}

describe('product test suites', () => {
  beforeAll(truncateProductDatabase)

  afterEach(truncateProductDatabase)

  describe('/product/:id GET', () => {
    beforeEach(insertDefaultProduct)

    test('reject product with an invalid id', async () => {
      const response = await request(server).get('/product/1')
      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Product ID must be a valid UUID.')
    })

    test('return a product not found message', async () => {
      const response = (
        await request(server).get('/product/aaee571c-ad99-4344-b75a-57b6a1a66a28')
      )
      expect(response.status).toEqual(404)
      expect(response.body.message).toEqual('Product not found.')
    })

    test('get product by id successfully', async () => {
      const response = (
        await request(server).get('/product/5e392019-3d9a-463f-a5cd-a7e7e631be1c')
      )
      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        id: '5e392019-3d9a-463f-a5cd-a7e7e631be1c',
        name: 'Arroz Alteza 1Kg',
        price: 6.49
      })
    })
  })

  describe('/product POST', () => {
    test('reject product with no name', async () => {
      const response = (
        await request(server).post('/product').send({ name: '', price: 6.49 })
      )
      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Product name should not be empty.')
    })

    test('reject product with name less than six characters', async () => {
      const response = (
        await request(server).post('/product').send({ name: 'Arroz', price: 6.49 })
      )
      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Product name must have at least six characters.')
    })

    test('reject product with price less than or equals zero', async () => {
      const response = (
        await request(server).post('/product').send({ name: 'Arroz Alteza 1Kg', price: 0 })
      )
      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Product price must be a number greater than zero.')
    })

    test('create product successfully', async () => {
      const response = (
        await request(server).post('/product').send({ name: 'Arroz Alteza 1Kg', price: 6.49 })
      )
      expect(response.status).toEqual(201)
      expect(response.body.message).toEqual('Product successfully created.')
    })
  })
})
