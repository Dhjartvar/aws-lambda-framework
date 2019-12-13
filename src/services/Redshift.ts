import Store from '../container/Database'
import Container, { Service } from 'typedi'
import { DatabaseToken } from '../container/DatabaseToken'
import RedshiftConfig from '../storage/RedshiftConfig'
import { Environment } from '../container/Environment'
import {
  Client as RedshiftConnection,
  Pool as RedshiftPool,
  Client,
  QueryResult,
  PoolClient as RedshiftPoolClient
} from 'pg'

@Service({ id: DatabaseToken })
export default class Redshift implements Store {
  private connection?: RedshiftConnection
  private pool?: RedshiftPool
  private poolConnections: RedshiftPoolClient[] = []
  readonly config: RedshiftConfig = {
    connectionString: process.env.REDSHIFT_CONNECTION_STRING,
    database: process.env.REDSHIFT_DB,
    host: process.env.REDSHIFT_HOST,
    password: process.env.REDSHIFT_PASS,
    user: process.env.REDSHIFT_USER,
    port: process.env.REDSHIFT_PORT ? parseInt(process.env.REDSHIFT_PORT) : undefined,
    connectionTimeoutMillis: parseInt(process.env.REDSHIFT_CONNECTION_TIMEOUT ?? '0')
  }

  constructor() {
    this.validateConfig()
  }

  protected validateConfig() {
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

  protected createPool(): RedshiftPool {
    try {
      return new RedshiftPool(this.config)
    } catch (err) {
      throw `Encountered ${err} while creating Aurora pool with config: ${this.config}`
    }
  }

  protected async connect(): Promise<RedshiftConnection> {
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
    if (Container.get('pooling')) return this.poolExecute(formattedSql, inputs)
    else return this.connectionExecute(formattedSql, inputs)
  }

  protected async poolExecute(sql: string, inputs?: any[]): Promise<unknown> {
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

  protected async connectionExecute(sql: string, inputs?: any[]): Promise<unknown> {
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
    if (Container.get('environment') === Environment.Development && this.pool) await this.pool.end()
  }
}
