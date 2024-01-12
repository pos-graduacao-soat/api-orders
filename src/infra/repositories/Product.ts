import { inject, injectable } from 'tsyringe'
import { Knex } from 'knex'
import { IProductRepository } from '../../domain/ports/repositories/Product'
import { Product } from '../../domain/entities/Product'

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject('MySqlDatabase') protected readonly database: Knex
  ) { }
  async create(product: Product): Promise<boolean> {
    const [createdProduct] = await this.database('products')
      .insert({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description
      })

    return createdProduct === 0
  }

  async getById(id: string): Promise<Product | null> {
    const product = await this.database('products').where('id', id).first()

    if (!product) return null

    return new Product({
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
    })
  }

  async getByIds(ids: string[]): Promise<Product[]> {
    const products = await this.database('products').whereIn('id', ids)

    return products.map(product => new Product({
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
    }))
  }

  async list(filters: Partial<Product>): Promise<Product[]> {
    const parsedFilters = this.buildFilters(filters)

    const products = await this.database('products').where(parsedFilters)

    return products.map(product => new Product({
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
    }))
  }

  async update(product: Partial<Product>): Promise<boolean> {
    const parsedFilters = this.buildFilters(product)

    const isUpdated = await this.database('products').where('id', product.id).update({ ...parsedFilters, updated_at: new Date() })

    return isUpdated === 1
  }

  private buildFilters(filters: Partial<Product>) {
    const filtersArray = Object.entries(filters)

    const filtersObject: any = {}

    filtersArray.forEach(([key, value]) => {
      if (value) filtersObject[key] = value
    })

    return filtersObject
  }
}