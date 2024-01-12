import 'reflect-metadata'
import { config } from 'dotenv'

config()

import '../main/factories'
import { startHttpServer } from '../presentation/gateway/httpServer'


startHttpServer()