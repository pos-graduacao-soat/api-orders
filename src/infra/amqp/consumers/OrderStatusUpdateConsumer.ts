import { inject, injectable } from 'tsyringe'
import RabbitMQService from '../RabbitMQService'
import { IUpdateOrderStatusUseCase } from '../../../domain/usecases'

@injectable()
export class OrderStatusUpdateConsumer {
  queue = 'update-order-status'

  constructor(
    @inject('RabbitMQService')
    private rabbitMQService: RabbitMQService,
    @inject('IUpdateOrderStatusUseCase')
    private updateOrderStatusUseCase: IUpdateOrderStatusUseCase
  ) { }

  async consume(): Promise<void> {
    await this.rabbitMQService.consume(this.queue, async (message) => {
      if (message) {
        const paymentData = JSON.parse(message.content.toString())

        if (!paymentData.id || !paymentData.status) {
          this.rabbitMQService.nack(message)
          return
        }

        console.log(`[OrderStatusUpdateConsumer] Consumed message with orderId: ${paymentData.id} and status: ${paymentData.status}`)

        await this.updateOrderStatusUseCase.update({ orderId: paymentData.id, status: paymentData.status })

        this.rabbitMQService.ack(message)
      }
    })
  }
}