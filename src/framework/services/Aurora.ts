import mysql, {
  Connection as AuroraConnection,
  Pool as AuroraPool,
  ConnectionOptions as AuroraConfig,
  PoolOptions as AuroraPoolConfig
} from 'mysql2/promise'
import Connection from '../interfaces/Connection'
import { Environment } from '../enums/Environment'
import { injectable } from 'inversify'
import { Property } from '@framework/symbols/Property'
import LambdaContainer from '@framework/LambdaContainer'

@injectable()
export default class Aurora implements Connection {
  private connection?: AuroraConnection
  private pooling: boolean = true
  private pool?: AuroraPool
  private config: AuroraConfig = {
    host: process.env.AURORA_HOST,
    database: process.env.AURORA_DB,
    user: process.env.AURORA_USER,
    password: process.env.AURORA_PASS
  }
  private poolConfig: AuroraPoolConfig = {
    ...this.config,
    ...{
      connectionLimit: parseInt(process.env.AURORA_CONNECTION_LIMIT ?? '10')
    }
  }

  configure(config: AuroraConfig, pooling: boolean = true, poolConfig: AuroraPoolConfig) {
    this.config = config
    this.pooling = pooling
    if (poolConfig) this.poolConfig = { ...config, ...poolConfig }
  }

  private async connect(): Promise<AuroraConnection> {
    try {
      return mysql.createConnection(this.config)
    } catch (err) {
      throw `Encountered ${err} while creating Aurora connection with config: ${this.config}`
    }
  }

  private createPool(): AuroraPool {
    try {
      return mysql.createPool(this.poolConfig)
    } catch (err) {
      throw `Encountered ${err} while creating Aurora pool with config: ${this.poolConfig}`
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<unknown> {
    if (this.pooling) return this.poolExecute(sql, inputs)
    else return this.connectionExecute(sql, inputs)
  }

  private async poolExecute(sql: string, inputs?: any[]): Promise<unknown> {
    if (!this.pool) this.pool = this.createPool()

    try {
      let [rows] = await this.pool.execute(sql, inputs)
      return rows
    } catch (err) {
      throw `Encountered ${err} while executing query: ${sql} ${inputs ? '\nWith input: ' + inputs : ''}`
    }
  }

  private async connectionExecute(sql: string, inputs?: any[]): Promise<unknown> {
    if (!this.connection) this.connection = await this.connect()

    try {
      let [rows] = await this.connection.execute(sql, inputs)
      return rows
    } catch (err) {
      throw `Encountered ${err} while executing query: ${sql} ${inputs ? '\nWith input: ' + inputs : ''}`
    }
  }

  async end(): Promise<void> {
    if (this.connection) await this.connection.end()
    if (LambdaContainer.get(Property.ENVIRONMENT) === Environment.Test && this.pool) await this.pool.end()
  }
}
