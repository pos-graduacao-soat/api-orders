import { Order } from "../../entities/Order";
import { UpdateOrderStatusDTO } from "./UpdateOrderStatusDTO";

export interface IUpdateOrderStatusUseCase {
  update: (params: UpdateOrderStatusDTO) => Promise<Order>
}