import 'reflect-metadata'
import request from 'supertest'
import { Server } from 'http'
import fs from 'fs'

import { startHttpServer } from '../../../../src/presentation/gateway/httpServer'
import { initializeContainer, startConsumers } from '../../../../src/main/factories'
import { Knex, knex } from 'knex'
import config from '../../../../knexfile'
import { container } from 'tsyringe'
import { Order, Status } from '../../../../src/domain/entities/Order'

const mockHttpService = {
  get: jest.fn().mockResolvedValue({ status: 200, data: {} }),
  patch: jest.fn().mockResolvedValue({ status: 200, data: {} }),
  axiosInstance: {
    get: jest.fn(),
    patch: jest.fn(),
  } as any
}

jest.mock('../../../../src/infra/http/HttpService', () => {
  return {
    __esModule: true, // this property makes it work
    HttpService: jest.fn().mockImplementation(() => mockHttpService)
  }
})

jest.mock('../../../../src/infra/amqp/RabbitMQService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn(),
      publish: jest.fn(),
      ack: jest.fn(),
      consume: jest.fn(),
      disconnect: jest.fn(),
      nack: jest.fn(),
    }
  })
})

jest.mock('../../../../knexfile', () => {
  const config: Knex.Config = {
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite',
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'migrations',
    },
  }

  return config
})

describe('CustomerRoutes', () => {
  let server: Server
  let connection: Knex

  beforeAll(async () => {
    connection = knex(config)
    const migrate = await connection.migrate.latest()
  })

  afterAll((done) => {
    server.close(() => {
      connection.destroy().then(() => {
        fs.unlinkSync('./test.sqlite')
        done()
      })
    })
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    container.clearInstances()

    await connection.table('orders').truncate()
    await connection.table('order_products').truncate()
  })

  describe('POST /orders', () => {
    it('should return 404 if customerId exists in params but entity service returns 404', async () => {
      mockHttpService.get.mockResolvedValue({ status: 404, data: {} })

      await initializeContainer()
      await startConsumers()
      server = startHttpServer()

      const response = await request(server).post('/orders').send({ customerId: '123' })

      expect(response.status).toBe(404)
    })

    it('should return 400 if products length is zero', async () => {
      mockHttpService.get.mockResolvedValue({ status: 200, data: {} })

      initializeContainer()

      const response = await request(server).post('/orders').send({ products: [] })
      console.log(response.body)
      expect(response.status).toBe(400)
    })

    it('should return 400 if products have no id', async () => {
      mockHttpService.get.mockResolvedValue({ status: 200, data: {} })

      initializeContainer()

      const response = await request(server).post('/orders').send({ products: [{ quantity: 1 }] })

      expect(response.status).toBe(400)
    })

    it('should return 400 if products have no quantity', async () => {
      mockHttpService.get.mockResolvedValue({ status: 200, data: {} })

      initializeContainer()

      const response = await request(server).post('/orders').send({ products: [{ id: '123' }] })

      expect(response.status).toBe(400)
    })

    it('should return 500 if product ids returns differents or is missing produts from entity api', async () => {
      mockHttpService.get.mockResolvedValueOnce({
        status: 200, data: {
          data: [{
            id: '1234',
            name: 'product',
            category: 'category',
            description: 'description',
            image: 'image',
            price: 1
          }]
        }
      })

      initializeContainer()

      const response = await request(server).post('/orders').send({ products: [{ id: '123', quantity: 1 }] })

      expect(response.status).toBe(500)
    })

    it('should return 200 and created order data', async () => {
      mockHttpService.get.mockResolvedValueOnce({
        status: 200, data: {
          data: [{
            id: '123',
            name: 'product',
            category: 'category',
            description: 'description',
            image: 'image',
            price: 1
          }]
        }
      })

      initializeContainer()

      const response = await request(server).post('/orders').send({ products: [{ id: '123', quantity: 1 }] })

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.status).toEqual(Status.WAITINGPAYMENT)
      expect(response.body.data.totalPrice).toEqual(1)
      expect(response.body.data.products).toHaveLength(1)
      expect(response.body.data.products[0].id).toEqual('123')
    })
  })

  describe('GET /orders/:orderId', () => {
    it('should return 404 if order does not exist', async () => {

      initializeContainer()

      const response = await request(server).get('/orders/123')

      expect(response.status).toBe(404)
    })

    it('should return 200 and order data', async () => {
      await connection.table('orders').insert({
        id: '123',
        status: Status.WAITINGPAYMENT,
        total_price: 1,
      })

      await connection.table('order_products').insert({
        id: '123',
        product_id: '123',
        order_id: '123',
        quantity: 1,
        name: 'product',
        price: 1,
      })

      initializeContainer()

      const response = await request(server).get('/orders/123')

      expect(response.status).toBe(200)
      expect(response.body.data.id).toEqual('123')
      expect(response.body.data.status).toEqual(Status.WAITINGPAYMENT)
      expect(response.body.data.totalPrice).toEqual(1)
      expect(response.body.data.products).toHaveLength(1)
      expect(response.body.data.products[0].id).toEqual('123')
    })
  })

  describe('GET /orders/', () => {
    it('should return 200 and orders data', async () => {
      const order = new Order({
        id: '123',
        status: Status.WAITINGPAYMENT,
        totalPrice: 1,
        products: [{
          id: '123',
          name: 'product',
          category: 'category',
          description: 'description',
          image: 'image',
          price: 1,
          quantity: 1
        }]
      })

      await connection.table('orders').insert([{
        id: '123',
        status: Status.WAITINGPAYMENT,
        total_price: 1,
      },
      {
        id: '1234',
        status: Status.RECEIVED,
        total_price: 11,
      }])

      await connection.table('order_products').insert([{
        id: '123',
        product_id: '123',
        order_id: '123',
        quantity: 1,
        name: 'product',
        price: 1,
      },
      {
        id: '1234',
        product_id: '123',
        order_id: '1234',
        quantity: 10,
        name: 'product',
        price: 1,
      }])

      initializeContainer()

      const response = await request(server).get('/orders')

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
    })
  })

  describe('PATCH /orders/:orderId', () => {
    it('should return 400 if order status is invalid', async () => {
      initializeContainer()

      const response = await request(server).patch('/orders/123').send({ status: 'invalid' })

      expect(response.status).toBe(400)
    })

    it('should return 404 if order is not found', async () => {
      initializeContainer()

      const response = await request(server).patch('/orders/123').send({ status: Status.DONE })

      expect(response.status).toBe(404)
    })

    it('should return 200 if order is updated', async () => {
      await connection.table('orders').insert({
        id: '123',
        status: Status.WAITINGPAYMENT,
        total_price: 1,
      })

      await connection.table('order_products').insert({
        id: '123',
        product_id: '123',
        order_id: '123',
        quantity: 1,
        name: 'product',
        price: 1,
      })

      initializeContainer()

      const order = await connection.table('orders').where({ id: '123' }).first()

      expect(order.status).toEqual(Status.WAITINGPAYMENT)

      const response = await request(server).patch('/orders/123').send({ status: Status.DONE })

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBe('123')
      expect(response.body.data.status).toBe(Status.DONE)
    })
  })
})