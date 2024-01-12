import { Order } from "../../entities/Order";
import { ListOrdersDTO } from "./ListOrdersDTO";

export interface IListOrdersUseCase {
  list: (params: ListOrdersDTO) => Promise<Order[]>
}