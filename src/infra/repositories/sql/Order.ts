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
        quantity: product.quantity,
        name: product.name,
        price: product.price,
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
          name: product.name,
          price: product.price,
        })
      })
    })
  }

  async updateStatus(id: string, status: Status): Promise<boolean> {
    const update = await this.database('orders').where('id', id).update({ status, updated_at: new Date() })

    return update > 0
  }

  async list(filters: Partial<Order>): Promise<Order[]> {
    const rows = await this.database('orders')
      .where(this.buildFilters(filters))
      .join('order_products', 'orders.id', '=', 'order_products.order_id')
      .orderBy('orders.created_at', 'desc')
      .select('orders.*', 'order_products.*')

    const ordersMap: { [id: string]: Order } = {}

    for (const row of rows) {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = new Order({
          id: row.order_id,
          status: row.status,
          totalPrice: row.total_price,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          customer: row.customer_id ? new Customer({ id: row.customer_id }) : undefined,
          products: []
        })
      }

      const orderProduct = new OrderProduct({
        id: row.id,
        quantity: row.quantity,
        name: row.name,
        price: row.price,
      })

      ordersMap[row.order_id].products.push(orderProduct)
    }

    return Object.values(ordersMap)
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