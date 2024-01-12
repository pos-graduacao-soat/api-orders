import { inject, injectable } from "tsyringe";
import { MissingNecessaryDataError } from "../../errors/MissingNecessaryData";
import { InvalidParamError } from "../../errors/InvalidParam";
import { IOrderRepository } from "../../ports/repositories/Order";
import { CreateOrderDTO } from "./CreateOrderDTO";
import { ICreateOrderUseCase } from "./ICreateOrder";
import { Order, OrderProduct, Status } from "../../entities/Order";
import { Customer } from "../../entities/Customer";
import { IProductRepository } from "../../ports/repositories/Product";
import { NotFoundError } from "../../errors/NotFoundError";
import { ICustomerRepository } from "../../ports/repositories/Customer";
import * as Payment from "../../entities/Payment";
import { IPaymentRepository } from "../../ports/repositories/Payment";

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
    const { products, totalPrice, customerId } = params

    const calculatedTotalPrice = products.reduce((acc, product) => acc + product.price * product.quantity, 0)

    this.validateProductsParams(products)
    
    await this.validateProductExist(products)

    if(customerId)
      await this.validateCustomerExist(customerId)

    const parsedProducts = products.map(product => new OrderProduct({ id: product.id, price: product.price, quantity: product.quantity }))

    const order = new Order({
      customer: customerId ? new Customer({ id: customerId }) : undefined,
      products: parsedProducts,
      totalPrice: calculatedTotalPrice,
      status: Status.WAITINGPAYMENT
    })

    const isCreated = await this.orderRepository.create(order);

    if (!isCreated) throw new Error('Order not created')

    await this.createPayment(order.id)

    const createdProduct = await this.orderRepository.getById(order.id)

    return createdProduct!;
  }

  private async createPayment(orderId: string) {
    const payment = new Payment.Payment({
        orderId: orderId,
        status: Payment.Status.RECEIVED
    })

    const isCreated = await this.paymentRepository.create(payment);

    if (!isCreated){
      await this.orderRepository.updateStatus(orderId, Status.PAYMENTPROBLEM)

      throw new Error('Payment not created')
    } 
  }

  private validateProductsParams(products: CreateOrderDTO['products']) {
    if (!products || products.length === 0) throw new MissingNecessaryDataError('Missing necessary data: products')

    const productsAreValid = products.every(product => product.quantity && product.id && product.price)

    if (!productsAreValid) throw new InvalidParamError('Invalid param: products')
  }

  private async validateProductExist(products: CreateOrderDTO['products']){
    const productIds = products.map(product => product.id)

    const foundProducts = await this.productRepository.getByIds(productIds)

    if(products.length !== foundProducts.length) throw new NotFoundError('Products not found')
  }

  private async validateCustomerExist(customerId: string){
    const foundCustomer = await this.customerRepository.getById(customerId)
    
    if(!foundCustomer) throw new NotFoundError('Customer not found')
  }
}