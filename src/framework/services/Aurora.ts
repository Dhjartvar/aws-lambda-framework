import mysql, {
  Connection as AuroraConnection,
  Pool as AuroraPool,
  ConnectionOptions as AuroraConfig,
  PoolOptions as AuroraPoolConfig,
  RowDataPacket,
  OkPacket
} from 'mysql2/promise'
import { injectable } from 'inversify'
import LambdaContainer from '@framework/LambdaContainer'
import { Environment } from '@framework/enums/Environment'
import Connection from '@framework/interfaces/Connection'
import { Property } from '@framework/symbols/Property'
import { QUERY_ERROR, CONNECTION_ERROR } from '@framework/constants/Errors'

@injectable()
export default class Aurora implements Connection {
  private connection?: AuroraConnection
  private pool?: AuroraPool
  pooling: boolean = true
  config: AuroraConfig = {
    host: process.env.AURORA_HOST,
    database: process.env.AURORA_DB,
    user: process.env.AURORA_USER,
    password: process.env.AURORA_PASS
  }
  poolConfig: AuroraPoolConfig = {
    ...this.config,
    ...{
      connectionLimit: parseInt(process.env.AURORA_CONNECTIONS_LIMIT ?? '10')
    }
  }

  setConfig(config: AuroraConfig) {
    this.config = config

    return this
  }

  setPoolConfig(poolConfig: AuroraPoolConfig) {
    this.poolConfig = poolConfig

    return this
  }

  setPooling(enabled: boolean) {
    this.pooling = enabled

    return this
  }

  private async connect(): Promise<AuroraConnection> {
    try {
      return mysql.createConnection(this.config)
    } catch (err) {
      throw CONNECTION_ERROR(err, this.constructor.name, this.config)
    }
  }

  private createPool(): AuroraPool {
    try {
      return mysql.createPool(this.poolConfig)
    } catch (err) {
      throw CONNECTION_ERROR(err, this.constructor.name, this.poolConfig)
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<any[]> {
    if (this.pooling) return this.poolExecute(sql, inputs)
    else return this.connectionExecute(sql, inputs)
  }

  private async poolExecute(sql: string, inputs?: any[]): Promise<any[]> {
    if (!this.pool) this.pool = this.createPool()

    try {
      let [rows] = await this.pool.execute(sql, inputs)
      return rows as any[]
    } catch (err) {
      throw QUERY_ERROR(err, sql, inputs)
    }
  }

  private async connectionExecute(sql: string, inputs?: any[]): Promise<any[]> {
    if (!this.connection) this.connection = await this.connect()

    try {
      let [rows] = await this.connection.execute(sql, inputs)
      return rows as any[]
    } catch (err) {
      throw QUERY_ERROR(err, sql, inputs)
    }
  }

  async end(): Promise<void> {
    if (this.connection) await this.connection.end()
    if (LambdaContainer.get(Property.ENVIRONMENT) === Environment.Test && this.pool) await this.pool.end()
  }
}
