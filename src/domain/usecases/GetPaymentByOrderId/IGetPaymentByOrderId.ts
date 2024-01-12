import { Payment } from "../../entities/Payment";
import { GetPaymentByOrderIdDTO } from "./GetPaymentByOrderIdDTO";

export interface IGetPaymentByOrderIdUseCase {
    get: (params: GetPaymentByOrderIdDTO) => Promise<Payment>
}