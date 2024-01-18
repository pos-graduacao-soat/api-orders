import { ValueObject } from './valueObject'

export class Customer extends ValueObject<Customer> {
  constructor(props: Partial<Customer>) {
    super(props)
  }

  public id: string

  public name?: string

  public email?: string

  public documentNumber?: string

}