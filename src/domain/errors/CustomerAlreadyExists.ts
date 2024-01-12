import { BusinessError, BusinessErrorType } from "./BusinessError"

export class CustomerAlreadyExistsError extends BusinessError {
  constructor(message?: string) {
    super(BusinessErrorType.AlreadyExists)

    this.name = 'CustomerAlreadyExistsError'
    this.message = message ?? 'Customer already exists.'
  }
}