import { inject, injectable } from 'tsyringe'
import RabbitMQService from '../RabbitMQService'
import { IUpdateOrderStatusUseCase } from '../../../domain/usecases'

@injectable()
export class PaymentStatusUpdateConsumer {
  queue = 'update-order'
  constructor(
    @inject('RabbitMQService')
    private rabbitMQService: RabbitMQService,
    @inject('IUpdateOrderStatusUseCase')
    private UpdateOrderStatusUseCase: IUpdateOrderStatusUseCase
  ) { }

  async consume(): Promise<void> {
    await this.rabbitMQService.consume(this.queue, async (message) => {
      if (message) {
        const paymentData = JSON.parse(message.content.toString())

        if (!paymentData.id || !paymentData.status) {
          this.rabbitMQService.ack(message)
          return
        }

        await this.UpdateOrderStatusUseCase.update({ orderId: paymentData.id, status: paymentData.status })
      }
    })
  }
}