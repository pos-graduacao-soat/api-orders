import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { ok } from '../adapters/HttpResponseAdapter'
import { IHttpResponse } from '../interfaces/IHttpResponse'
import { IListOrdersUseCase } from '../../domain/usecases/ListOrders/IListOrders'

@injectable()
export class ListOrdersController implements IController {
  constructor(
    @inject('IListOrdersUseCase')
    readonly listOrdersUseCase: IListOrdersUseCase
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { status, customerId, done } = httpRequest.query

    const result = await this.listOrdersUseCase.list({ status, customerId, done })

    return ok(result)
  }
} 