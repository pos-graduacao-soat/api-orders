import { inject, injectable } from 'tsyringe'
import { IOrderRepository } from '../../ports/repositories/Order'
import { Status, } from '../../entities/Order'
import { NotFoundError } from '../../errors/NotFoundError'
import { IStartProductionOfOrderUseCase } from './IStartProductionOfOrder'
import { InvalidParamError } from '../../errors/InvalidParam'
import { StartProductionOfOrderDTO } from './StartProductionOfOrderDTO'
import { ProductionOrderProducer } from '../../../infra/amqp/producers/ProductionOrderProducer'

@injectable()
export class StartProductionOfOrderUseCase implements IStartProductionOfOrderUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @inject('ProductionOrderProducer')
    private readonly productionOrderProducer: ProductionOrderProducer,
  ) { }

  async execute(params: StartProductionOfOrderDTO): Promise<void> {
    const { orderId, status } = params

    const isValidStatus = Object.values(Status).includes(status as Status)

    if (!isValidStatus) throw new InvalidParamError('Invalid param: status')

    const isUpdated = await this.orderRepository.updateStatus(orderId, status as Status)

    if (!isUpdated) throw new NotFoundError('Order not found')

    if (status === Status.SUCCESSFULPAYMENT) {
      const order = await this.orderRepository.getById(orderId)

      await this.productionOrderProducer.publish(JSON.stringify({ order }))
    }
  }
}