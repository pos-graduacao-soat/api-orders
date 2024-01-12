import { Customer } from '../../entities/Customer'

export interface ICustomerRepository {
  getById: (id: string) => Promise<Customer | null>
}