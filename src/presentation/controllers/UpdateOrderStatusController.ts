import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { ok } from '../adapters/HttpResponseAdapter'
import { IHttpResponse } from '../interfaces/IHttpResponse'
import { UpdateOrderStatusUseCase } from '../../domain/usecases/UpdateOrderStatus/UpdateOrderStatus'

@injectable()
export class UpdateOrderStatusController implements IController {
  constructor(
    @inject('IUpdateOrderStatusUseCase')
    readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { status } = httpRequest.body
    const { orderId } = httpRequest.params

    const result = await this.updateOrderStatusUseCase.update({ status, orderId })

    return ok(result)
  }
} 