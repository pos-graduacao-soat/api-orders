import { BusinessError, BusinessErrorType } from "./BusinessError"

export class MissingEmailError extends BusinessError {
  constructor(message?: string) {
    super(BusinessErrorType.MissingNecessaryData)

    this.name = 'MissingEmailError'
    this.message = message ?? 'Email is required'
  }
}