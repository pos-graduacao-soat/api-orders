import { ValueObject } from './valueObject'

export class Payment extends ValueObject<Payment> {
  public constructor(props: Partial<Payment>) {
    super(props)
  }

  public orderId: string

  public status: Status
}

export enum Status {
  RECEIVED = 'RECEIVED',
  PAID = 'PAID',
  NOTPAID = 'NOT_PAID'
}