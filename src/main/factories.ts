import { container } from 'tsyringe'
import { CreateOrderUseCase, GetOrderByIdUseCase, ICreateOrderUseCase, IGetOrderByIdUseCase, IListOrdersUseCase, IUpdateOrderStatusUseCase, ListOrdersUseCase, UpdateOrderStatusUseCase, } from '../domain/usecases'
import { KnexConnection } from '../infra/database/knex'
import { HttpCustomerRepository, HttpProductRepository, MySqlOrderRepository } from '../infra/repositories'
import { HttpService } from '../infra/http/HttpService'
import RabbitMQService from '../infra/amqp/RabbitMQService'
import { PaymentStatusUpdateConsumer } from '../infra/amqp/consumers/PaymentStatusUpdateConsumer'
import { env } from './env'
import { StartProductionOfOrderUseCase } from '../domain/usecases/StartProductionOfOrder/StartProductionOfOrder'
import { IStartProductionOfOrderUseCase } from '../domain/usecases/StartProductionOfOrder/IStartProductionOfOrder'
import { ProductionOrderProducer } from '../infra/amqp/producers/ProductionOrderProducer'
import { OrderStatusUpdateConsumer } from '../infra/amqp/consumers/OrderStatusUpdateConsumer'

export async function initializeContainer() {
  const rabbitMQService = new RabbitMQService(env.rabbitMQUrl)

  await rabbitMQService.connect()

  container.registerInstance('MySqlDatabase', new KnexConnection().getConnection())
  container.registerInstance('HttpService', new HttpService({ validateStatus: () => true }))
  container.registerInstance('RabbitMQService', rabbitMQService)

  container.registerSingleton('ICustomerRepository', HttpCustomerRepository)
  container.registerSingleton('IProductRepository', HttpProductRepository)
  container.registerSingleton('IOrderRepository', MySqlOrderRepository)

  container.registerSingleton('PaymentStatusUpdateConsumer', PaymentStatusUpdateConsumer)
  container.registerSingleton('OrderStatusUpdateConsumer', OrderStatusUpdateConsumer)

  container.registerSingleton('ProductionOrderProducer', ProductionOrderProducer)

  container.register<ICreateOrderUseCase>('ICreateOrderUseCase', CreateOrderUseCase)
  container.register<IGetOrderByIdUseCase>('IGetOrderByIdUseCase', GetOrderByIdUseCase)
  container.register<IListOrdersUseCase>('IListOrdersUseCase', ListOrdersUseCase)
  container.register<IUpdateOrderStatusUseCase>('IUpdateOrderStatusUseCase', UpdateOrderStatusUseCase)
  container.register<IStartProductionOfOrderUseCase>('IStartProductionOfOrderUseCase', StartProductionOfOrderUseCase)
}

export async function startConsumers() {
  const paymentStatusUpdateConsumer = container.resolve<PaymentStatusUpdateConsumer>('PaymentStatusUpdateConsumer')
  const orderStatusUpdateConsumer = container.resolve<OrderStatusUpdateConsumer>('OrderStatusUpdateConsumer')
  paymentStatusUpdateConsumer.consume().then(() => console.log('PaymentStatusUpdateConsumer Consumer started'))
  orderStatusUpdateConsumer.consume().then(() => console.log('OrderStatusUpdateConsumer Consumer started'))
}