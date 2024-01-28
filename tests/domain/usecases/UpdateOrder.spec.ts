import 'reflect-metadata'
import { Order, Status } from '../../../src/domain/entities/Order'
import { InvalidParamError } from '../../../src/domain/errors/InvalidParam'
import { NotFoundError } from '../../../src/domain/errors/NotFoundError'
import { IOrderRepository } from '../../../src/domain/ports/repositories/Order'
import { UpdateOrderStatusUseCase } from '../../../src/domain/usecases/UpdateOrderStatus/UpdateOrderStatus'

describe('UpdateOrderStatusUseCase', () => {
  let orderRepositoryMock: jest.Mocked<IOrderRepository>
  let useCase: UpdateOrderStatusUseCase

  beforeEach(() => {
    orderRepositoryMock = {
      updateStatus: jest.fn(),
      getById: jest.fn(),
    } as any

    useCase = new UpdateOrderStatusUseCase(orderRepositoryMock)
  })

  it('should throw InvalidParamError if status is invalid', async () => {
    await expect(useCase.update({ orderId: '1', status: 'invalid' as any })).rejects.toThrow(InvalidParamError)
  })

  it('should throw NotFoundError if order is not found', async () => {
    orderRepositoryMock.updateStatus.mockResolvedValue(false)

    await expect(useCase.update({ orderId: '1', status: Status.RECEIVED })).rejects.toThrow(NotFoundError)
  })

  it('should throw NotFoundError if order is not found after update', async () => {
    orderRepositoryMock.updateStatus.mockResolvedValue(true)
    orderRepositoryMock.getById.mockResolvedValue(null)

    await expect(useCase.update({ orderId: '1', status: Status.READY })).rejects.toThrow(NotFoundError)
  })

  it('should return the updated order if it exists and status is valid', async () => {
    const order = new Order({ id: '1', status: Status.READY, products: [], totalPrice: 1 })
    orderRepositoryMock.updateStatus.mockResolvedValue(true)
    orderRepositoryMock.getById.mockResolvedValue(order)

    const result = await useCase.update({ orderId: '1', status: Status.READY })

    expect(result).toBe(order)
  })
})