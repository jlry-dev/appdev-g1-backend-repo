const { Pool } = require('pg')
require('dotenv').config()

const pool =
    process.env.NODE_ENV === 'production'
        ? new Pool({
              connectionString: process.env.DB_CONNECTION_STRING,
          })
        : new Pool({
              host: process.env.DB_HOST,
              database: process.env.DB_NAME,
              user: process.env.DB_USER,
              port: process.env.DB_PORT,
              password: process.env.DB_PASSWORD,
          })

module.exports = pool
