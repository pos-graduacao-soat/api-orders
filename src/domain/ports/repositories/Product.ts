import { Product } from '../../valueObjects/Product'

export interface IProductRepository {
  getById: (id: string) => Promise<Product | null>
  getByIds: (ids: string[]) => Promise<Product[]>
}