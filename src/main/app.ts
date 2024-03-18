import 'reflect-metadata'
import { config } from 'dotenv'

config()

import '../main/factories'
import { startHttpServer } from '../presentation/gateway/httpServer'
import { initializeContainer, startConsumers } from '../main/factories'

async function startApp() {
  await initializeContainer()
  await startConsumers()
  startHttpServer()
}

startApp().catch(error => {
  console.error('Failed to start app:', error)
})