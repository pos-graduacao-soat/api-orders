import { ValueObject } from './valueObject'

export class Product extends ValueObject<Product> {
  constructor(props: Partial<Product>) {
    super(props)
  }
  public id: string

  public name: string

  public price: number

  public category: string

  public description: string

  public image: string
}