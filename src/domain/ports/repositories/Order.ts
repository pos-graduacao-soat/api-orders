import { Order, Status } from '../../entities/Order'

export interface IOrderRepository {
  create: (order: Order) => Promise<boolean>
  list: (filters: Partial<Order>) => Promise<Order[]>
  getById: (id: string) => Promise<Order | null>
  updateStatus: (id: string, status: Status) => Promise<boolean>
}