import { inject, injectable } from 'tsyringe'
import RabbitMQService from '../RabbitMQService'
import { IStartProductionOfOrderUseCase } from '../../../domain/usecases/StartProductionOfOrder/IStartProductionOfOrder'

@injectable()
export class PaymentStatusUpdateConsumer {
  queue = 'update-order'

  constructor(
    @inject('RabbitMQService')
    private rabbitMQService: RabbitMQService,
    @inject('IStartProductionOfOrderUseCase')
    private startProductionOfOrderUseCase: IStartProductionOfOrderUseCase
  ) { }

  async consume(): Promise<void> {
    await this.rabbitMQService.consume(this.queue, async (message) => {
      if (message) {
        const paymentData = JSON.parse(message.content.toString())

        if (!paymentData.id || !paymentData.status) {
          this.rabbitMQService.nack(message)
          return
        }

        console.log(`[PaymentStatusUpdateConsumer] Consumed message with orderId: ${paymentData.id} and status: ${paymentData.status}`)

        await this.startProductionOfOrderUseCase.execute({ orderId: paymentData.id, status: paymentData.status })

        this.rabbitMQService.ack(message)
      }
    })
  }
}