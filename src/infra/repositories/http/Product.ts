import { inject, injectable } from 'tsyringe'
import { IHttpResponseModel } from '../../http/interfaces/IHttpResponseModel'
import { env } from '../../../main/env'
import { HttpService } from '../../http/HttpService'
import { IProductRepository } from '../../../domain/ports/repositories/Product'
import { Product } from '../../../domain/valueObjects/Product'

interface GetProductByIdResponseModel extends IHttpResponseModel {
  data: {
    id: string
    name: string
    category: string
    description: string
    image: string
    price: number
  }
}

interface GetProductsByIdsResponseModel extends IHttpResponseModel {
  data: {
    id: string
    name: string
    category: string
    description: string
    image: string
    price: number
  }[]
}

@injectable()
export class HttpProductRepository implements IProductRepository {
  baseUrl = env.productsApiUrl

  constructor(
    @inject('HttpService') protected readonly httpService: HttpService
  ) { }

  async getById(id: string): Promise<Product | null> {
    const productResponse = await this.httpService.get<GetProductByIdResponseModel>(`${this.baseUrl}/products/${id}`)

    const { data } = productResponse

    return new Product({
      id: data.data.id,
      name: data.data.name,
      category: data.data.category,
      description: data.data.description,
      image: data.data.image,
      price: data.data.price
    })
  }

  async getByIds(ids: string[]): Promise<Product[]> {
    const stringIds = ids.join(',')

    const productsResponse = await this.httpService.get<GetProductsByIdsResponseModel>(`${this.baseUrl}/products/ids?ids=${stringIds}`)

    const { data } = productsResponse

    return data.data.map(productData => new Product({
      id: productData.id,
      name: productData.name,
      category: productData.category,
      description: productData.description,
      image: productData.image,
      price: productData.price
    }))
  }
}