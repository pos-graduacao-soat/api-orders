import { inject, injectable } from 'tsyringe'
import { Knex } from 'knex'
import { IPaymentRepository } from '../../domain/ports/repositories/Payment'
import { Payment, Status } from '../../domain/entities/Payment'

@injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @inject('MySqlDatabase') protected readonly database: Knex
  ) { }

  async create(payment: Payment): Promise<boolean> {
    const trx = await this.database.transaction()

    try {
      await trx('payments').insert({
        id: payment.id,
        orderId: payment.orderId,
        status: payment.status
      })

      await trx.commit()

      return true
    } catch (error) {
      await trx.rollback()

      return false
    }
  }

  async getByOrderId(orderId: string): Promise<Payment | null> {
    const payment = await this.database('payments').where('payments.orderId', orderId).first()

    if (!payment) return null

    return new Payment({
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status
    })
  }

  async getById(id: string): Promise<Payment | null> {
    const payment = await this.database('payments').where('payments.id', id).first()

    if (!payment) return null

    return new Payment({
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status
    })
  }

  async updateStatus(id: string, status: Status): Promise<boolean> {
    const update = await this.database('payments').where('id', id).update({ status, updated_at: new Date() })

    return update > 0
  }
}