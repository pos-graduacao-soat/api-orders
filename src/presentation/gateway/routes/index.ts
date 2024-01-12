import { Router } from 'express'
import { customerRoutes } from './CustomerRoutes'
import { orderRoutes } from './OrderRoutes'
import { productRoutes } from './ProductRoutes'
// import { utilRoutes } from './UtilsRoutes'
import { paymentRoutes } from './PaymentRoutes'

const routes = Router()

routes.use(customerRoutes)
routes.use(productRoutes)
routes.use(orderRoutes)
// routes.use(utilRoutes)
routes.use(paymentRoutes)

export { routes }