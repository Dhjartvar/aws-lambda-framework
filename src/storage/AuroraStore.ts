import mysql, { Connection, ConnectionOptions, PoolOptions } from 'mysql2/promise'
import Store from './Store'
import Container, { Service } from 'typedi'
import { StoreToken } from './StoreToken'
import AuroraConfig from './AuroraConfig'
import { Environment } from './Environment'

@Service({ id: StoreToken })
export default class AuroraStore extends Store {
  config: AuroraConfig = {
    connectionLimit: process.env.AURORA_CONNECTION_LIMIT ? parseInt(process.env.AURORA_CONNECTION_LIMIT) : 10,
    connectTimeout: process.env.AURORA_CONNECTION_TIMEOUT ? parseInt(process.env.AURORA_CONNECTION_TIMEOUT) : 10,
    host: process.env.AURORA_HOST,
    database: process.env.AURORA_DB,
    user: process.env.AURORA_USER,
    password: process.env.AURORA_PASS
  }

  protected initializePool(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  protected initializeConnection(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  validateConfig() {
    if (process.env.AURORA_USER) throw 'Missing Aurora credential: AURORA_USER'
    if (process.env.AURORA_PASS) throw 'Missing Aurora credential: AURORA_PASS'
    if (process.env.AURORA_HOST) throw 'Missing Aurora credential: AURORA_HOST'
    if (process.env.AURORA_DB) throw 'Missing Aurora credential: AURORA_DB'
  }

  async connect(): Promise<void> {
    try {
      throw 'TODO'
      //if (this.pool) this.connection = await mysql.createPool(this.config)
    } catch (err) {
      throw `Encountered ${err} while creating connection with config: ${this.config}`
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<unknown> {
    // if (!this.conn) throw `Cannot execute query ${sql} because no connection has been opened.`

    try {
      throw 'TODO'
      //let [rows] = await this.conn.execute(sql, inputs)
      // return rows
    } catch (err) {
      throw `Encountered ${err} while executing query: ${sql} ${inputs ? '\nWith input: ' + inputs : ''}`
    }
  }

  end(): void {
    if (this.connection) this.connection.end()
    if (Container.get('environment') === Environment.Development && this.pool) this.pool.end()
  }
}
