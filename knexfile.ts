import dotenv from 'dotenv'
import { Knex } from 'knex'

dotenv.config()

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    port: Number(process.env.DB_PORT),
  },
  migrations: {
    tableName: 'migrations',
  },
}

export default config