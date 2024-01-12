import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { ok } from '../adapters/HttpResponseAdapter'
import { ICreateOrderUseCase } from '../../domain/usecases/CreateOrder/ICreateOrder'
import { IHttpResponse } from '../interfaces/IHttpResponse'

@injectable()
export class CreateOrderController implements IController {
  constructor(
    @inject('ICreateOrderUseCase')
    readonly createOrderUseCase: ICreateOrderUseCase,
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { customerId, totalPrice, products } = httpRequest.body

    const result = await this.createOrderUseCase.create({ customerId, totalPrice, products })

    return ok(result, 'Order created')
  }
} 