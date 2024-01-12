import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../ports/repositories/Order";
import { Order, Status, } from "../../entities/Order";
import { NotFoundError } from "../../errors/NotFoundError";
import { IUpdateOrderStatusUseCase } from "./IUpdateOrderStatus";
import { UpdateOrderStatusDTO } from "./UpdateOrderStatusDTO";
import { InvalidParamError } from "../../errors/InvalidParam";

@injectable()
export class UpdateOrderStatusUseCase implements IUpdateOrderStatusUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository
  ) { }

  async update(params: UpdateOrderStatusDTO): Promise<Order> {
    const { orderId, status } = params

    const isValidStatus = Object.values(Status).includes(status as Status)

    if (!isValidStatus) throw new InvalidParamError('Invalid param: status')

    const isUpdated = await this.orderRepository.updateStatus(orderId, status as Status)

    if (!isUpdated) throw new NotFoundError('Order not found')

    const order = await this.orderRepository.getById(orderId);

    if (!order) throw new NotFoundError('Order not found')

    return order;
  }
}