import 'reflect-metadata'
import { IOrderRepository } from '../../../src/domain/ports/repositories/Order'
import { IProductRepository } from '../../../src/domain/ports/repositories/Product'
import { ICustomerRepository } from '../../../src/domain/ports/repositories/Customer'
import { CreateOrderUseCase } from '../../../src/domain/usecases/CreateOrder/CreateOrder'
import { MissingNecessaryDataError } from '../../../src/domain/errors/MissingNecessaryData'
import { InvalidParamError } from '../../../src/domain/errors/InvalidParam'
import { NotFoundError } from '../../../src/domain/errors/NotFoundError'
import { Product } from '../../../src/domain/valueObjects/Product'
import { Order, OrderProduct, Status } from '../../../src/domain/entities/Order'
import { Customer } from '../../../src/domain/valueObjects/Customer'


describe('CreateOrderUseCase', () => {
  let orderRepositoryMock: jest.Mocked<IOrderRepository>
  let productRepositoryMock: jest.Mocked<IProductRepository>
  let customerRepositoryMock: jest.Mocked<ICustomerRepository>
  let useCase: CreateOrderUseCase

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn(),
      getById: jest.fn(),
    } as any

    productRepositoryMock = {
      getByIds: jest.fn(),
    } as any

    customerRepositoryMock = {
      getById: jest.fn(),
    } as any

    useCase = new CreateOrderUseCase(orderRepositoryMock, productRepositoryMock, customerRepositoryMock)
  })

  it('should throw MissingNecessaryDataError if products are missing', async () => {
    await expect(useCase.create({ products: [] })).rejects.toThrow(MissingNecessaryDataError)
  })

  it('should throw InvalidParamError if products are invalid', async () => {
    await expect(useCase.create({ products: [{ id: '1', quantity: 0 }] })).rejects.toThrow(InvalidParamError)
  })

  it('should throw NotFoundError if products are not found', async () => {
    productRepositoryMock.getByIds.mockResolvedValue([])

    await expect(useCase.create({ products: [{ id: '1', quantity: 1 }], customerId: '1' })).rejects.toThrow(NotFoundError)
  })

  it('should throw NotFoundError if customer is not found', async () => {
    productRepositoryMock.getByIds.mockResolvedValue([new Product({ id: '1', name: 'Product 1', price: 10, category: 'Category 1' })])
    customerRepositoryMock.getById.mockResolvedValue(null)

    await expect(useCase.create({ products: [{ id: '1', quantity: 1 }], customerId: '1' })).rejects.toThrow(NotFoundError)
  })

  it('should throw an error if order is not created', async () => {
    const product = new Product({ id: '1', name: 'Product 1', price: 10, category: 'Category 1' })
    const customer = new Customer({ id: '1', name: 'Customer 1', email: 'customer1@example.com' })

    productRepositoryMock.getByIds.mockResolvedValue([product])
    customerRepositoryMock.getById.mockResolvedValue(customer)
    orderRepositoryMock.create.mockResolvedValue(false)

    await expect(useCase.create({ products: [{ id: '1', quantity: 1 }], customerId: '1' })).rejects.toThrow('Order not created')
  })

  it('should throw an error if created order is not found', async () => {
    const product = new Product({ id: '1', name: 'Product 1', price: 10, category: 'Category 1' })
    const customer = new Customer({ id: '1', name: 'Customer 1', email: 'customer1@example.com' })

    productRepositoryMock.getByIds.mockResolvedValue([product])
    customerRepositoryMock.getById.mockResolvedValue(customer)
    orderRepositoryMock.create.mockResolvedValue(true)
    orderRepositoryMock.getById.mockResolvedValue(null)

    await expect(useCase.create({ products: [{ id: '1', quantity: 1 }], customerId: '1' })).rejects.toThrow('Order not created')
  })

  it('should return the created order if it is valid', async () => {
    const product = new Product({ id: '1', name: 'Product 1', price: 10, category: 'Category 1' })
    const customer = new Customer({ id: '1', name: 'Customer 1', email: 'customer1@example.com' })
    const order = new Order({ id: '1', customer, products: [new OrderProduct({ id: '1', name: 'Product 1', price: 10, quantity: 1, category: 'Category 1' })], totalPrice: 10, status: Status.WAITINGPAYMENT })

    productRepositoryMock.getByIds.mockResolvedValue([product])
    customerRepositoryMock.getById.mockResolvedValue(customer)
    orderRepositoryMock.create.mockResolvedValue(true)
    orderRepositoryMock.getById.mockResolvedValue(order)

    const result = await useCase.create({ products: [{ id: '1', quantity: 1 }], customerId: '1' })

    expect(result).toBe(order)
  })
})