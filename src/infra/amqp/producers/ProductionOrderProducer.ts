import { inject, injectable } from 'tsyringe'
import RabbitMQService from '../RabbitMQService'

@injectable()
export class ProductionOrderProducer {
  exchange = 'production-orders'
  routingKey = 'start-production-order'

  constructor(
    @inject('RabbitMQService')
    private readonly rabbitMQService: RabbitMQService
  ) { }

  async publish(message: string): Promise<void> {
    return this.rabbitMQService.publish(this.exchange, this.routingKey, message)
  }
}