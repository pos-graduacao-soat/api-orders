import { Order } from "../../entities/Order";
import { GetOrderByIdDTO } from "./GetOrderByIdDTO";

export interface IGetOrderByIdUseCase {
  get: (params: GetOrderByIdDTO) => Promise<Order>
}