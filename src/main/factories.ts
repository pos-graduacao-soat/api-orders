import { container } from 'tsyringe'
import { CreateCustomerUseCase, CreateOrderUseCase, CreateProductUseCase, GetOrderByIdUseCase, ICreateCustomerUseCase, ICreateOrderUseCase, ICreateProductUseCase, IGetOrderByIdUseCase, IListOrdersUseCase, IListProductsUseCase, IUpdateOrderStatusUseCase, IUpdateProductUseCase, ListOrdersUseCase, ListProductsUseCase, UpdateOrderStatusUseCase, UpdateProductUseCase } from '../domain/usecases'
import { KnexConnection } from '../infra/database/knex'
import { CustomerRepository, OrderRepository, PaymentRepository, ProductRepository } from '../infra/repositories'
import { IGetPaymentByOrderIdUseCase } from '../domain/usecases/GetPaymentByOrderId/IGetPaymentByOrderId'
import { GetPaymentByOrderIdUseCase } from '../domain/usecases/GetPaymentByOrderId/GetPaymentByOrderId'
import { IUpdatePaymentStatusUseCase } from '../domain/usecases/UpdatePaymentStatus/IUpdatePaymentStatus'
import { UpdatePaymentStatusUseCase } from '../domain/usecases/UpdatePaymentStatus/UpdatePaymentStatus'

container.registerInstance('MySqlDatabase', new KnexConnection().getConnection())

container.registerSingleton('ICustomerRepository', CustomerRepository)
container.registerSingleton('IProductRepository', ProductRepository)
container.registerSingleton('IOrderRepository', OrderRepository)
container.registerSingleton('IPaymentRepository', PaymentRepository)

container.register<ICreateCustomerUseCase>('ICreateCustomerUseCase', CreateCustomerUseCase)
container.register<ICreateProductUseCase>('ICreateProductUseCase', CreateProductUseCase)
container.register<IListProductsUseCase>('IListProductsUseCase', ListProductsUseCase)
container.register<ICreateOrderUseCase>('ICreateOrderUseCase', CreateOrderUseCase)
container.register<IGetOrderByIdUseCase>('IGetOrderByIdUseCase', GetOrderByIdUseCase)
container.register<IGetPaymentByOrderIdUseCase>('IGetPaymentByOrderIdUseCase', GetPaymentByOrderIdUseCase)
container.register<IListOrdersUseCase>('IListOrdersUseCase', ListOrdersUseCase)
container.register<IUpdateOrderStatusUseCase>('IUpdateOrderStatusUseCase', UpdateOrderStatusUseCase)
container.register<IUpdateProductUseCase>('IUpdateProductUseCase', UpdateProductUseCase)
container.register<IUpdatePaymentStatusUseCase>('IUpdatePaymentStatusUseCase', UpdatePaymentStatusUseCase)
