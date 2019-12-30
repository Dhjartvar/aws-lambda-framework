import mysql, {
  Connection as AuroraConnection,
  Pool as AuroraPool,
  ConnectionOptions as AuroraConfig,
  PoolOptions as AuroraPoolConfig
} from 'mysql2/promise'
import { injectable } from 'inversify'
import Connection from '@framework/interfaces/Connection'
import { LambdaContainer, Environment, Property } from '../../aws-lambda-framework'

@injectable()
export class Aurora implements Connection {
  connection?: AuroraConnection
  pool?: AuroraPool
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

  private createPool(): AuroraPool {
    try {
      return mysql.createPool(this.poolConfig)
    } catch (err) {
      throw Error(err)
    }
  }

  private async connect(): Promise<AuroraConnection> {
    try {
      return mysql.createConnection(this.config)
    } catch (err) {
      throw Error(err)
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<any[]> {
    if (LambdaContainer.get<boolean>(Property.LOGGING))
      console.log(`SQL: ${sql}\n${inputs ? `Inputs: [${inputs}]` : ''}`)

    if (this.pooling) return this.poolExecute(sql, inputs)
    else return this.connectionExecute(sql, inputs)
  }

  private async poolExecute(sql: string, inputs?: any[]): Promise<any[]> {
    if (!this.pool) this.pool = this.createPool()

    try {
      let [rows] = await this.pool.execute(sql, inputs)
      return rows as any[]
    } catch (err) {
      throw Error(err)
    }
  }

  private async connectionExecute(sql: string, inputs?: any[]): Promise<any[]> {
    if (!this.connection) this.connection = await this.connect()

    try {
      let [rows] = await this.connection.execute(sql, inputs)
      return rows as any[]
    } catch (err) {
      throw Error(err)
    }
  }

  async end(): Promise<void> {
    if (this.connection) await this.connection.end()
    if (LambdaContainer.get(Property.ENVIRONMENT) === Environment.Test && this.pool) await this.pool.end()
  }
}
