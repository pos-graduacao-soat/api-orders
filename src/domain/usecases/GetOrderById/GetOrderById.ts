import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../ports/repositories/Order";
import { Order, } from "../../entities/Order";
import { GetOrderByIdDTO } from "./GetOrderByIdDTO";
import { NotFoundError } from "../../errors/NotFoundError";
import { IGetOrderByIdUseCase } from "./IGetOrderById";

@injectable()
export class GetOrderByIdUseCase implements IGetOrderByIdUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository
  ) { }

  async get(params: GetOrderByIdDTO): Promise<Order> {
    const { orderId } = params

    const order = await this.orderRepository.getById(orderId);

    if (!order) throw new NotFoundError('Order not found')

    return order!;
  }
}