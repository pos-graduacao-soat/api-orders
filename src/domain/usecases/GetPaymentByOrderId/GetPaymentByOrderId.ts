import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../errors/NotFoundError";
import { IPaymentRepository } from "../../ports/repositories/Payment";
import { GetPaymentByOrderIdDTO } from "./GetPaymentByOrderIdDTO";
import { Payment } from "../../entities/Payment";
import { IGetPaymentByOrderIdUseCase } from "./IGetPaymentByOrderId";

@injectable()
export class GetPaymentByOrderIdUseCase implements IGetPaymentByOrderIdUseCase {
    constructor(
        @inject('IPaymentRepository')
        private readonly paymentRepository: IPaymentRepository
    ) { }

    async get(params: GetPaymentByOrderIdDTO): Promise<Payment> {
        const { orderId } = params

        const payment = await this.paymentRepository.getByOrderId(orderId);

        if (!payment) throw new NotFoundError('Payment not found')

        return payment!;
    }
}