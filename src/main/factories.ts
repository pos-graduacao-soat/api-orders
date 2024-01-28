import { container } from 'tsyringe'
import { CreateOrderUseCase, GetOrderByIdUseCase, ICreateOrderUseCase, IGetOrderByIdUseCase, IListOrdersUseCase, IUpdateOrderStatusUseCase, ListOrdersUseCase, UpdateOrderStatusUseCase, } from '../domain/usecases'
import { KnexConnection } from '../infra/database/knex'
import { HttpCustomerRepository, HttpProductRepository, MySqlOrderRepository } from '../infra/repositories'
import { HttpService } from '../infra/http/HttpService'

export function initializeContainer() {
  container.registerInstance('MySqlDatabase', new KnexConnection().getConnection())
  container.registerInstance('HttpService', new HttpService({ validateStatus: () => true }))

  container.registerSingleton('ICustomerRepository', HttpCustomerRepository)
  container.registerSingleton('IProductRepository', HttpProductRepository)
  container.registerSingleton('IOrderRepository', MySqlOrderRepository)

  container.register<ICreateOrderUseCase>('ICreateOrderUseCase', CreateOrderUseCase)
  container.register<IGetOrderByIdUseCase>('IGetOrderByIdUseCase', GetOrderByIdUseCase)
  container.register<IListOrdersUseCase>('IListOrdersUseCase', ListOrdersUseCase)
  container.register<IUpdateOrderStatusUseCase>('IUpdateOrderStatusUseCase', UpdateOrderStatusUseCase)
}