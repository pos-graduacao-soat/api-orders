export interface CreateOrderDTO {
  products: {
    id: string
    quantity: number
  }[]
  customerId?: string
}