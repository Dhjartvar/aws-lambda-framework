import mysql, {
  Connection as MysqlConnection,
  Pool as MysqlPool,
  ConnectionOptions as MysqlConfig,
  PoolOptions as MysqlPoolConfig
} from 'mysql2/promise'
import { injectable } from 'inversify'
import Connection from '@framework/interfaces/Connection'
import { LambdaContainer, Environment, Property } from '../../aws-lambda-framework'
import { Result } from '@framework/types/Result'

@injectable()
export class Mysql implements Connection {
  connection?: MysqlConnection
  pool?: MysqlPool
  pooling: boolean = true
  config: MysqlConfig = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS
  }
  poolConfig: MysqlPoolConfig = {
    ...this.config,
    ...{
      connectionLimit: parseInt(process.env.MYSQL_CONNECTIONS_LIMIT ?? '10')
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<Result<any[], Error>> {
    if (LambdaContainer.get<boolean>(Property.LOGGING))
      console.log(`SQL: ${sql}\n${inputs ? `Inputs: [${inputs}]` : ''}`)

    if (this.pooling) return this.poolExecute(sql, inputs)
    else return this.connectionExecute(sql, inputs)
  }

  private async poolExecute(sql: string, inputs?: any[]): Promise<Result<any[], Error>> {
    try {
      if (!this.pool) this.pool = mysql.createPool(this.poolConfig)

      const [rows] = await this.pool.execute(sql, inputs)

      return {
        success: true,
        result: rows as any[]
      }
    } catch (err) {
      return {
        success: false,
        error: err
      }
    }
  }

  private async connectionExecute(sql: string, inputs?: any[]): Promise<Result<any[], Error>> {
    try {
      if (!this.connection) this.connection = await mysql.createConnection(this.config)

      const [rows] = await this.connection.execute(sql, inputs)

      return {
        success: true,
        result: rows as any[]
      }
    } catch (err) {
      return {
        success: false,
        error: err
      }
    }
  }

  async end(): Promise<void> {
    if (this.connection) await this.connection.end()
    if (LambdaContainer.get(Property.ENVIRONMENT) === Environment.Test && this.pool) await this.pool.end()
  }
}
