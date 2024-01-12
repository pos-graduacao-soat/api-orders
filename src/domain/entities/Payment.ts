import { Entity } from './Entity'

export class Payment extends Entity<Payment> {
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