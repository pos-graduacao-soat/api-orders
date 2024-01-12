import { Entity } from './Entity'

export class Customer extends Entity<Customer> {
  constructor(props: Partial<Customer>) {
    super(props)
  }

  public readonly id: string

  public createdAt: Date

  public updatedAt: Date

  public name?: string

  public email?: string

  public documentNumber?: string

}