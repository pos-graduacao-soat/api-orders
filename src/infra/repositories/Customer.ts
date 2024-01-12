import { inject, injectable } from 'tsyringe'
import { ICustomerRepository } from '../../domain/ports/repositories/Customer'
import { Knex } from 'knex'
import { Customer } from '../../domain/entities/Customer'

@injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @inject('MySqlDatabase') protected readonly database: Knex
  ) { }
  async create(customer: Customer): Promise<boolean> {
    const [createdCustomer] = await this.database('customers')
      .insert({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        document_number: customer.documentNumber
      })

    return createdCustomer === 0
  }

  async getById(id: string): Promise<Customer | null> {
    const customer = await this.database('customers').where('id', id).first()

    if (!customer) return null

    return new Customer({
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
      id: customer.id,
      name: customer.name,
      email: customer.email,
      documentNumber: customer.document_number
    })
  }

  async getByEmail(email: string): Promise<Customer | null> {
    const customer = await this.database('customers').where('email', email).first()

    if (!customer) return null

    return new Customer({
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
      id: customer.id,
      name: customer.name,
      email: customer.email,
      documentNumber: customer.document_number
    })
  }

  async getByDocumentNumber(documentNumber: string): Promise<Customer | null> {
    const customer = await this.database('customers').where('document_number', documentNumber).first()

    if (!customer) return null

    return new Customer({
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
      id: customer.id,
      name: customer.name,
      email: customer.email,
      documentNumber: customer.document_number
    })
  }
}