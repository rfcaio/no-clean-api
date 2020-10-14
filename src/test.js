const request = require('supertest')

const { db, server } = require('.')

const truncateProductDatabase = done => {
  db.run('DELETE FROM product', error => {
    if (!error) {
      done()
    }
  })
}

describe('product test suites', () => {
  beforeEach(truncateProductDatabase)

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
