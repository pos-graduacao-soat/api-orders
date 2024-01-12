import { Router } from 'express'
import { container } from 'tsyringe'
import { adaptRoute } from '../../adapters/ExpressRouteAdapter'
import { CreateOrderController } from '../../controllers/CreateOrderController'
import { GetOrderByIdController } from '../../controllers/GetOrderByIdController'
import { ListOrdersController } from '../../controllers/ListOrdersController'
import { UpdateOrderStatusController } from '../../controllers/UpdateOrderStatusController'

function registerOrderRoutes(router: Router): Router {
  router.post('/orders', adaptRoute(container.resolve(CreateOrderController)))
  router.get('/orders/:orderId', adaptRoute(container.resolve(GetOrderByIdController)))
  router.patch('/orders/:orderId', adaptRoute(container.resolve(UpdateOrderStatusController)))
  router.get('/orders/', adaptRoute(container.resolve(ListOrdersController)))

  return router
}

export { registerOrderRoutes }