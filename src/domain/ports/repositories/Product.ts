import { Product } from '../../entities/Product'

export interface IProductRepository {
  list: (filters: Partial<Product>) => Promise<Product[]>
  getById: (id: string) => Promise<Product | null>
  getByIds: (ids: string[]) => Promise<Product[]>
}