import {
  Client as RedshiftConnection,
  Pool as RedshiftPool,
  Client,
  QueryResult,
  PoolClient as RedshiftPoolClient,
  ConnectionConfig as RedshiftConfig,
  PoolConfig as RedshiftPoolConfig
} from 'pg'
import { injectable } from 'inversify'
import LambdaContainer from '@framework/LambdaContainer'
import Connection from '@framework/interfaces/Connection'
import { Environment } from '@framework/enums/Environment'
import { Property } from '@framework/symbols/Property'
import { QUERY_ERROR, CONNECTION_ERROR } from '@framework/constants/Errors'

@injectable()
export default class Redshift implements Connection {
  private connection?: RedshiftConnection
  private pool?: RedshiftPool
  private poolConnections: RedshiftPoolClient[] = []
  pooling: boolean = true
  config: RedshiftConfig = {
    connectionString: process.env.REDSHIFT_CONNECTION_STRING,
    database: process.env.REDSHIFT_DB,
    host: process.env.REDSHIFT_HOST,
    password: process.env.REDSHIFT_PASS,
    user: process.env.REDSHIFT_USER,
    port: process.env.REDSHIFT_PORT ? parseInt(process.env.REDSHIFT_PORT) : undefined
  }
  poolConfig: RedshiftPoolConfig = {
    ...this.config,
    ...{
      max: parseInt(process.env.REDSHIFT_CONNECTIONS_LIMIT ?? '0')
    }
  }

  setConfig(config: RedshiftConfig) {
    this.config = config

    return this
  }

  setPoolConfig(poolConfig: RedshiftPoolConfig) {
    this.poolConfig = poolConfig

    return this
  }

  setPooling(enabled: boolean) {
    this.pooling = enabled

    return this
  }

  private createPool(): RedshiftPool {
    try {
      return new RedshiftPool(this.poolConfig)
    } catch (err) {
      throw CONNECTION_ERROR(err, this.constructor.name, this.poolConfig)
    }
  }

  private async connect(): Promise<RedshiftConnection> {
    try {
      let connection = new Client(this.config)
      await connection.connect()
      return connection
    } catch (err) {
      throw CONNECTION_ERROR(err, this.constructor.name, this.config)
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<any[]> {
    let formattedSql = this.replaceQuestionMarks(sql)
    if (this.pooling) return this.poolExecute(formattedSql, inputs)
    else return this.connectionExecute(formattedSql, inputs)
  }

  private async poolExecute(sql: string, inputs?: any[]): Promise<any[]> {
    if (!this.pool) this.pool = this.createPool()

    let index = await this.connectAndGetIndex()

    try {
      let result: QueryResult = await this.poolConnections[index].query(sql, inputs)
      return result.rows
    } catch (err) {
      throw QUERY_ERROR(err, sql, inputs)
    } finally {
      this.poolConnections[index].release()
      delete this.poolConnections[index]
    }
  }

  /**
   * Opens a connection to the Redshift pool and adds it to an array of open connections
   * @returns Index of the new connection
   */
  private async connectAndGetIndex(): Promise<number> {
    try {
      this.poolConnections.push(await this.pool!.connect())
      return this.poolConnections.length - 1
    } catch (err) {
      throw CONNECTION_ERROR(err, this.constructor.name, this.poolConfig)
    }
  }

  private async connectionExecute(sql: string, inputs?: any[]): Promise<any[]> {
    if (!this.connection) this.connection = await this.connect()

    try {
      let result: QueryResult = await this.connection.query(sql, inputs)
      return result.rows
    } catch (err) {
      throw QUERY_ERROR(err, sql, inputs)
    }
  }

  private replaceQuestionMarks(sql: string): string {
    let i: number = 0
    return sql.replace(/\?/g, () => {
      i++
      return '$' + i
    })
  }

  async end(): Promise<void> {
    if (this.connection) await this.connection.end()
    if (LambdaContainer.get(Property.ENVIRONMENT) === Environment.Test && this.pool) await this.pool.end()
  }
}
