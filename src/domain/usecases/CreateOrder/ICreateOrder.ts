import { Order } from "../../entities/Order";
import { CreateOrderDTO } from "../CreateOrder/CreateOrderDTO";

export interface ICreateOrderUseCase {
  create: (params: CreateOrderDTO) => Promise<Order>
}