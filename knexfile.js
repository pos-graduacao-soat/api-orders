require('dotenv').config();

/**
 * @type {import('knex').Config}
 */
module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  },
  migrations: {
    tableName: 'migrations',
  },
};
