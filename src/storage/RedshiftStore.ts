import Store from './Store'
import Container, { Service } from 'typedi'
import { StoreToken } from './StoreToken'
import RedshiftConfig from './RedshiftConfig'
import { Environment } from './Environment'

@Service({ id: StoreToken })
export default class RedshiftStore extends Store {
  config: RedshiftConfig = {
    connectionString: process.env.REDSHIFT_CONNECTION_STRING,
    database: process.env.REDSHIFT_DB,
    host: process.env.REDSHIFT_HOST,
    password: process.env.REDSHIFT_PASS,
    user: process.env.REDSHIFT_USER,
    port: process.env.REDSHIFT_PORT ? parseInt(process.env.REDSHIFT_PORT) : undefined,
    connectionTimeoutMillis: parseInt(process.env.REDSHIFT_CONNECTION_TIMEOUT ?? '0')
  }

  protected initializePool(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  protected initializeConnection(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  validateConfig() {
    if (
      !process.env.REDSHIFT_CONNECTION_STRING ||
      (!process.env.REDSHIFT_HOST &&
        !process.env.REDSHIFT_DB &&
        !process.env.REDSHIFT_USER &&
        !process.env.REDSHIFT_PASS)
    )
      throw `Missing properties in Redshift config.
      Please provide either REDSHIFT_CONNECTION_STRING
      or REDSHIFT_HOST, REDSHIFT_DB, REDSHIFT_USER and REDSHIFT_PASS`
  }

  async connect(): Promise<void> {
    try {
      throw 'todo'
      //if (this.pool) this.connection = await mysql.createConnection(this.config)
    } catch (err) {
      throw `Encountered ${err} while creating connection with config: ${this.config}`
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<any> {
    throw 'todo'
    //if (!this.conn) throw `Cannot execute query ${sql} because no connection has been opened.`

    try {
      //let [rows] = await this.conn.execute(sql, inputs)
      //return rows
    } catch (err) {
      throw `Encountered ${err} while executing query: ${sql} ${inputs ? '\nWith input: ' + inputs : ''}`
    }
  }

  end(): void {
    if (this.connection) this.connection.end()
    if (Container.get('environment') === Environment.Development && this.pool) this.pool.end()
  }
}
