import 'reflect-metadata'
import { config } from 'dotenv'

config()

import '../main/factories'
import { startHttpServer } from '../presentation/gateway/httpServer'
import { initializeContainer } from '../main/factories'

async function startApp() {
  initializeContainer()
  startHttpServer()
}

startApp().catch(error => {
  console.error('Failed to start app:', error)
})