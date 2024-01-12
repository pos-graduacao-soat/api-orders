import { Status } from '../../entities/Order'

export interface ListOrdersDTO {
  customerId?: string
  status?: Status
  done?: string
}