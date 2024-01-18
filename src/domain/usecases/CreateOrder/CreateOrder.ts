import { inject, injectable } from 'tsyringe'
import { MissingNecessaryDataError } from '../../errors/MissingNecessaryData'
import { InvalidParamError } from '../../errors/InvalidParam'
import { IOrderRepository } from '../../ports/repositories/Order'
import { CreateOrderDTO } from './CreateOrderDTO'
import { ICreateOrderUseCase } from './ICreateOrder'
import { Order, OrderProduct, Status } from '../../entities/Order'
import { NotFoundError } from '../../errors/NotFoundError'
import { IProductRepository } from '../../ports/repositories/Product'
import { ICustomerRepository } from '../../ports/repositories/Customer'
import { Customer } from '../../valueObjects/Customer'
import { Product } from '../../valueObjects/Product'

@injectable()
export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) { }

  async create(params: CreateOrderDTO): Promise<Order> {
    const { products, customerId } = params

    if (customerId)
      await this.validateCustomerExist(customerId)

    this.validateProductsParams(products)

    const completeProducts = await this.getProducts(products)

    const orderProducts = products.map(product => this.createOrderProduct(product.id, product.quantity, completeProducts))

    const totalValue = orderProducts.reduce((sum, orderProduct) => sum + (orderProduct.price * orderProduct.quantity), 0)

    const order = new Order({
      customer: customerId ? new Customer({ id: customerId }) : undefined,
      products: orderProducts,
      totalPrice: totalValue,
      status: Status.WAITINGPAYMENT
    })

    const isCreated = await this.orderRepository.create(order)

    if (!isCreated) throw new Error('Order not created')

    const createdOrder = await this.orderRepository.getById(order.id)

    if (!createdOrder) throw new Error('Order not created')

    createdOrder.products = orderProducts

    return createdOrder
  }

  private validateProductsParams(products: CreateOrderDTO['products']) {
    if (!products || products.length === 0) throw new MissingNecessaryDataError('Missing necessary data: products')

    const productsAreValid = products.every(product => product.quantity && product.id)

    if (!productsAreValid) throw new InvalidParamError('Invalid param: products')
  }

  private async getProducts(products: CreateOrderDTO['products']): Promise<Product[]> {
    const productIds = products.map(product => product.id)

    const foundProducts = await this.productRepository.getByIds(productIds)

    if (products.length !== foundProducts.length) throw new NotFoundError('Products not found')

    return foundProducts
  }

  private async validateCustomerExist(customerId: string) {
    const foundCustomer = await this.customerRepository.getById(customerId)

    if (!foundCustomer) throw new NotFoundError('Customer not found')
  }

  private createOrderProduct(productId: string, quantity: number, completeProducts: Product[]) {
    const product = completeProducts.find(product => product.id === productId)

    if (!product) {
      throw new Error(`Product with id ${productId} not found`)
    }

    return new OrderProduct({
      id: productId,
      quantity,
      category: product.category,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    })
  }
}