import { inject, injectable } from 'tsyringe'
import { Customer } from '../../entities/Customer'
import { Order, Status } from '../../entities/Order'
import { IOrderRepository } from '../../ports/repositories/Order'
import { IListOrdersUseCase } from './IListOrders'
import { ListOrdersDTO } from './ListOrdersDTO'

@injectable()
export class ListOrdersUseCase implements IListOrdersUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository
  ) { }

  async list(params: ListOrdersDTO): Promise<Order[]> {
    const { customerId, status, done = '0' } = params

    const orders = await this.orderRepository.list({
      status,
      customer: customerId ? new Customer({ id: customerId }) : undefined
    })

    const sortedOrders = this.sortOrders(orders)

    if (done === '0') {
      return sortedOrders.filter(order => order.status !== Status.DONE)
    }

    return sortedOrders
  }

  private sortOrders(orders: Order[]): Order[] {  
    return orders.sort((a, b) => {
      const order = {
        [Status.WAITINGPAYMENT]: 1,
        [Status.PAYMENTPROBLEM]: 2,
        [Status.SUCCESSFULPAYMENT]: 3,
        [Status.READY]: 4,
        [Status.PREPARING]: 5,
        [Status.RECEIVED]: 6,
        [Status.DONE]: 7,
      }
      
      return order[a.status] - order[b.status]
    })
  
  }
}