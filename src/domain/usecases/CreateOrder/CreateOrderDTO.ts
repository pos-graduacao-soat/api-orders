export interface CreateOrderDTO {
  products: {
    id: string
    quantity: number
    price: number
  }[]
  customerId?: string
  totalPrice: number
}