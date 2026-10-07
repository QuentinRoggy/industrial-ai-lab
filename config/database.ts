import env from '#start/env'
import pg from 'pg'
import { defineConfig } from '@adonisjs/lucid'

/**
 * Read `date` columns as `YYYY-MM-DD` strings. The default parser builds a
 * local-midnight Date, which shifts calendar days with the server time zone.
 */
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value)

const dbConfig = defineConfig({
  connection: 'postgres',

  connections: {
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('DB_URL'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
