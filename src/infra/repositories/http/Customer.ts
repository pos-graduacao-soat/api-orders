import { inject, injectable } from 'tsyringe'
import { IHttpResponseModel } from '../../http/interfaces/IHttpResponseModel'
import { ICustomerRepository } from '../../../domain/ports/repositories/Customer'
import { env } from '../../../main/env'
import { HttpService } from '../../http/HttpService'
import { Customer } from '../../../domain/valueObjects/Customer'

interface GetCustomerByIdResponseModel extends IHttpResponseModel {
  data: {
    id: string
    name?: string
    email?: string
    documentNumber?: string
  }
}

@injectable()
export class HttpCustomerRepository implements ICustomerRepository {
  baseUrl = env.customersApiUrl

  constructor(
    @inject('HttpService') protected readonly httpService: HttpService
  ) { }

  async getById(id: string): Promise<Customer | null> {
    const customer = await this.httpService.get<GetCustomerByIdResponseModel>(`${this.baseUrl}/customers/${id}`)

    const { data } = customer

    if (customer.status !== 200) return null

    return new Customer({
      documentNumber: data.data.documentNumber,
      email: data.data.email,
      id: data.data.id,
      name: data.data.name
    })
  }
}