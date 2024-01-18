import { Customer } from '../../valueObjects/Customer'

export interface ICustomerRepository {
  getById: (id: string) => Promise<Customer | null>
}