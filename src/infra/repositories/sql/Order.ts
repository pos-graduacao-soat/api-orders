import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { v4 } from 'uuid'
import { IOrderRepository } from '../../../domain/ports/repositories/Order'
import { Order, OrderProduct, Status } from '../../../domain/entities/Order'
import { Customer } from '../../../domain/valueObjects/Customer'

@injectable()
export class MySqlOrderRepository implements IOrderRepository {
  constructor(
    @inject('MySqlDatabase') protected readonly database: Knex
  ) { }

  async create(order: Order): Promise<boolean> {
    const { customer, products, totalPrice } = order

    const trx = await this.database.transaction()

    try {
      await trx('orders').insert({
        id: order.id,
        status: order.status,
        customer_id: customer?.id,
        total_price: totalPrice
      })

      const orderProducts = products.map(product => ({
        id: v4(),
        product_id: product.id,
        order_id: order.id,
        quantity: product.quantity
      }))

      await trx('order_products').insert(orderProducts)

      await trx.commit()

      return true
    } catch (error) {
      await trx.rollback()

      return false
    }
  }

  async getById(orderId: string): Promise<Order | null> {
    const order = await this.database('orders').where('orders.id', orderId).first()

    if (!order) return null

    const orderProducts = await this.database('order_products').where('order_products.order_id', orderId)

    return new Order({
      id: order.id,
      status: order.status,
      totalPrice: order.total_price,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      products: orderProducts.map(product => {
        return new OrderProduct({
          id: product.id,
          quantity: product.quantity,
        })
      })
    })
  }

  async updateStatus(id: string, status: Status): Promise<boolean> {
    const update = await this.database('orders').where('id', id).update({ status, updated_at: new Date() })

    return update > 0
  }

  async list(filters: Partial<Order>): Promise<Order[]> {
    const orders = await this.database('orders').where(this.buildFilters(filters)).orderBy('created_at', 'desc')

    return orders.map(order => new Order({
      id: order.id,
      status: order.status,
      totalPrice: order.total_price,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      customer: order.customer_id ? new Customer({ id: order.customer_id }) : undefined
    }))
  }

  private buildFilters(filters: Partial<Order>) {
    const filtersArray = Object.entries(filters)

    const filtersObject: any = {}

    filtersArray.forEach(([key, value]) => {
      if (value && typeof value !== 'object') filtersObject[key] = value
    })

    if (filters.customer) filtersObject['customer_id'] = filters.customer.id

    return filtersObject
  }
}