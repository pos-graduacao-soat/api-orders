import { container } from 'tsyringe'
import { CreateOrderUseCase, GetOrderByIdUseCase, ICreateOrderUseCase, IGetOrderByIdUseCase, IListOrdersUseCase, IUpdateOrderStatusUseCase, ListOrdersUseCase, UpdateOrderStatusUseCase, } from '../domain/usecases'
import { KnexConnection } from '../infra/database/knex'
import { CustomerRepository, OrderRepository, PaymentRepository, ProductRepository } from '../infra/repositories'
import { IGetPaymentByOrderIdUseCase } from '../domain/usecases/GetPaymentByOrderId/IGetPaymentByOrderId'
import { GetPaymentByOrderIdUseCase } from '../domain/usecases/GetPaymentByOrderId/GetPaymentByOrderId'

container.registerInstance('MySqlDatabase', new KnexConnection().getConnection())

container.registerSingleton('ICustomerRepository', CustomerRepository)
container.registerSingleton('IProductRepository', ProductRepository)
container.registerSingleton('IOrderRepository', OrderRepository)
container.registerSingleton('IPaymentRepository', PaymentRepository)

container.register<ICreateOrderUseCase>('ICreateOrderUseCase', CreateOrderUseCase)
container.register<IGetOrderByIdUseCase>('IGetOrderByIdUseCase', GetOrderByIdUseCase)
container.register<IGetPaymentByOrderIdUseCase>('IGetPaymentByOrderIdUseCase', GetPaymentByOrderIdUseCase)
container.register<IListOrdersUseCase>('IListOrdersUseCase', ListOrdersUseCase)
container.register<IUpdateOrderStatusUseCase>('IUpdateOrderStatusUseCase', UpdateOrderStatusUseCase)
