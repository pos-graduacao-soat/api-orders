import { inject, injectable } from 'tsyringe'
import { MissingNecessaryDataError } from '../../errors/MissingNecessaryData'
import { InvalidParamError } from '../../errors/InvalidParam'
import { IOrderRepository } from '../../ports/repositories/Order'
import { CreateOrderDTO } from './CreateOrderDTO'
import { ICreateOrderUseCase } from './ICreateOrder'
import { Order, OrderProduct, Status } from '../../entities/Order'
import { Customer } from '../../entities/Customer'
import { NotFoundError } from '../../errors/NotFoundError'
import * as Payment from '../../entities/Payment'
import { IPaymentRepository } from '../../ports/repositories/Payment'
import { IProductRepository } from '../../ports/repositories/Product'
import { ICustomerRepository } from '../../ports/repositories/Customer'

@injectable()
export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) { }

  async create(params: CreateOrderDTO): Promise<Order> {
    const { products, customerId } = params

    const calculatedTotalPrice = products.reduce((acc, product) => acc + product.price * product.quantity, 0)

    this.validateProductsParams(products)

    await this.validateProductExist(products)

    if (customerId)
      await this.validateCustomerExist(customerId)

    const parsedProducts = products.map(product => new OrderProduct({ id: product.id, price: product.price, quantity: product.quantity }))

    const order = new Order({
      customer: customerId ? new Customer({ id: customerId }) : undefined,
      products: parsedProducts,
      totalPrice: calculatedTotalPrice,
      status: Status.WAITINGPAYMENT
    })

    const isCreated = await this.orderRepository.create(order)

    if (!isCreated) throw new Error('Order not created')

    const createdOrder = await this.orderRepository.getById(order.id)

    if (!createdOrder) throw new Error('Order not created')

    return createdOrder
  }

  private validateProductsParams(products: CreateOrderDTO['products']) {
    if (!products || products.length === 0) throw new MissingNecessaryDataError('Missing necessary data: products')

    const productsAreValid = products.every(product => product.quantity && product.id)

    if (!productsAreValid) throw new InvalidParamError('Invalid param: products')
  }

  private async validateProductExist(products: CreateOrderDTO['products']) {
    const productIds = products.map(product => product.id)

    const foundProducts = await this.productRepository.getByIds(productIds)

    if (products.length !== foundProducts.length) throw new NotFoundError('Products not found')
  }

  private async validateCustomerExist(customerId: string) {
    const foundCustomer = await this.customerRepository.getById(customerId)

    if (!foundCustomer) throw new NotFoundError('Customer not found')
  }
}