import 'reflect-metadata'
import { Status } from '../../../src/domain/entities/Order'
import { IOrderRepository } from '../../../src/domain/ports/repositories/Order'
import { StartProductionOfOrderUseCase } from '../../../src/domain/usecases/StartProductionOfOrder/StartProductionOfOrder'
import { StartProductionOfOrderDTO } from '../../../src/domain/usecases/StartProductionOfOrder/StartProductionOfOrderDTO'
import { ProductionOrderProducer } from '../../../src/infra/amqp/producers/ProductionOrderProducer'
import { InvalidParamError } from '../../../src/domain/errors/InvalidParam'
import { NotFoundError } from '../../../src/domain/errors/NotFoundError'

describe('StartProductionOfOrderUseCase', () => {
  let orderRepository: IOrderRepository
  let productionOrderProducer: ProductionOrderProducer
  let useCase: StartProductionOfOrderUseCase

  beforeEach(() => {
    orderRepository = {
      updateStatus: jest.fn().mockResolvedValue(true),
      getById: jest.fn().mockResolvedValue({}),
    } as unknown as IOrderRepository
    productionOrderProducer = {
      publish: jest.fn(),
    } as unknown as ProductionOrderProducer
    useCase = new StartProductionOfOrderUseCase(orderRepository, productionOrderProducer)
  })

  it('should update the status of an order', async () => {
    const params: StartProductionOfOrderDTO = {
      orderId: '1',
      status: Status.SUCCESSFULPAYMENT,
    }
    await useCase.execute(params)
    expect(orderRepository.updateStatus).toHaveBeenCalledWith(params.orderId, params.status)
  })

  it('should throw invalid param error if status is not valid', async () => {
    const params: StartProductionOfOrderDTO = {
      orderId: '1',
      status: 'wrong',
    }
    await expect(useCase.execute(params)).rejects.toThrow(InvalidParamError)
  })

  it('should throw not found error if update status return false', async () => {
    const params: StartProductionOfOrderDTO = {
      orderId: '1',
      status: Status.SUCCESSFULPAYMENT,
    }

    orderRepository.updateStatus = jest.fn().mockResolvedValue(false)

    await expect(useCase.execute(params)).rejects.toThrow(NotFoundError)
  })

  it('should publish a production order when the status is SUCCESSFULPAYMENT', async () => {
    const params: StartProductionOfOrderDTO = {
      orderId: '1',
      status: Status.SUCCESSFULPAYMENT,
    }
    await useCase.execute(params)
    expect(orderRepository.getById).toHaveBeenCalledWith(params.orderId)
    expect(productionOrderProducer.publish).toHaveBeenCalled()
  })

  it('should not publish a production order when the status is not SUCCESSFULPAYMENT', async () => {
    const params: StartProductionOfOrderDTO = {
      orderId: '1',
      status: Status.PAYMENTPROBLEM,
    }
    await useCase.execute(params)
    expect(orderRepository.getById).not.toHaveBeenCalled()
    expect(productionOrderProducer.publish).not.toHaveBeenCalled()
  })
})