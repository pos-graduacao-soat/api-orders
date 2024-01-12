import { Entity } from './Entity'

export class Product extends Entity<Product> {
  constructor(props: Partial<Product>) {
    super(props)
  }

  public name: string

  public category: Category

  public price: number

  public description: string

  public imageLink: string
}

export enum Category {
  MainCourses = 'MainCourses',
  SideDishes = 'SideDishes',
  Beverages = 'Beverages',
  Desserts = 'Desserts',
}