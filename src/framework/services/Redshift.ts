import Connection from '../interfaces/Connection'
import { Environment } from '../enums/Environment'
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
import { Property } from '@framework/symbols/Property'

@injectable()
export default class Redshift implements Connection {
  private connection?: RedshiftConnection
  private pooling: boolean = true
  private pool?: RedshiftPool
  private poolConnections: RedshiftPoolClient[] = []
  readonly config: RedshiftConfig = {
    connectionString: process.env.REDSHIFT_CONNECTION_STRING,
    database: process.env.REDSHIFT_DB,
    host: process.env.REDSHIFT_HOST,
    password: process.env.REDSHIFT_PASS,
    user: process.env.REDSHIFT_USER,
    port: process.env.REDSHIFT_PORT ? parseInt(process.env.REDSHIFT_PORT) : undefined
  }
  readonly poolConfig: RedshiftPoolConfig = {
    ...this.config,
    ...{
      connectionTimeoutMillis: parseInt(process.env.REDSHIFT_CONNECTION_TIMEOUT ?? '0')
    }
  }

  private createPool(): RedshiftPool {
    try {
      return new RedshiftPool(this.poolConfig)
    } catch (err) {
      throw `Encountered ${err} while creating Aurora pool with config: ${this.poolConfig}`
    }
  }

  private async connect(): Promise<RedshiftConnection> {
    try {
      let connection = new Client(this.config)
      await connection.connect()
      return connection
    } catch (err) {
      throw `Encountered ${err} while creating connection with config: ${this.config}`
    }
  }

  async execute(sql: string, inputs?: any[]): Promise<unknown> {
    let formattedSql = this.replaceQuestionMarks(sql)
    if (this.pooling) return this.poolExecute(formattedSql, inputs)
    else return this.connectionExecute(formattedSql, inputs)
  }

  private async poolExecute(sql: string, inputs?: any[]): Promise<unknown> {
    if (!this.pool) this.pool = this.createPool()

    let index = await this.connectAndGetIndex()

    try {
      let result: QueryResult = await this.poolConnections[index].query(sql, inputs)
      return result.rows
    } catch (err) {
      throw `Encountered ${err} while executing query: ${sql} ${inputs ? '\nWith input: ' + inputs : ''}`
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
      throw `Encountered ${err} while creating connection in Redshift pool using config: ${this.config}`
    }
  }

  private async connectionExecute(sql: string, inputs?: any[]): Promise<unknown> {
    if (!this.connection) this.connection = await this.connect()

    try {
      let result: QueryResult = await this.connection.query(sql, inputs)
      return result.rows
    } catch (err) {
      throw `Encountered ${err} while executing query: ${sql} ${inputs ? '\nWith input: ' + inputs : ''}`
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
