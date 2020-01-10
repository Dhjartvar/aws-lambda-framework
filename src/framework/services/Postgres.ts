import {
  Client as PostgresConnection,
  Pool as PostgresPool,
  PoolClient as PostgresPoolClient,
  ConnectionConfig as PostgresConfig,
  PoolConfig as PostgresPoolConfig
} from 'pg'
import { injectable } from 'inversify'
import Connection from '../interfaces/Connection'
import { LambdaContainer, Environment, Property } from '../../aws-lambda-framework'
import { Result } from '../types/Result'
import { Query } from '../interfaces/Query'
import 'reflect-metadata'
const TRANSACTION_SUCCESS_MESSAGE = 'Succesfully executed all queries in transaction!'

@injectable()
export class Postgres implements Connection {
  connection?: PostgresConnection
  pool?: PostgresPool
  poolConnections: PostgresPoolClient[] = []
  pooling: boolean = true
  config: PostgresConfig = {
    connectionString: process.env.Postgres_CONNECTION_STRING,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASS,
    user: process.env.POSTGRES_USER,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : undefined
  }
  poolConfig: PostgresPoolConfig = {
    ...this.config,
    ...{
      max: parseInt(process.env.POSTGRES_CONNECTIONS_LIMIT ?? '0')
    }
  }

  async execute<T>(query: Query): Promise<Result<Array<T>, Error>> {
    if (LambdaContainer.get<boolean>(Property.LOGGING))
      console.log(`SQL: ${query.sql}\n${query.inputs ? `Inputs: [${query.inputs}]` : ''}`)

    query.sql = this.replaceQuestionMarks(query.sql)
    if (this.pooling) return this.poolExecute(query)
    else return this.connectionExecute(query)
  }

  private replaceQuestionMarks(sql: string): string {
    let i: number = 0
    return sql.replace(/\?/g, () => {
      i++
      return '$' + i
    })
  }

  private async poolExecute<T>(query: Query): Promise<Result<Array<T>, Error>> {
    try {
      if (!this.pool) this.pool = new PostgresPool(this.poolConfig)

      const result = await this.pool.query(query.sql, query.inputs)

      return {
        success: true,
        rows: result.rows as Array<T>
      }
    } catch (err) {
      return {
        success: false,
        error: Error(err)
      }
    }
  }

  private async connectionExecute<T>(query: Query): Promise<Result<Array<T>, Error>> {
    try {
      if (!this.connection) {
        this.connection = new PostgresConnection(this.config)
        await this.connection.connect()
      }

      const result = await this.connection.query(query.sql, query.inputs)
      return {
        success: true,
        rows: result.rows as Array<T>
      }
    } catch (err) {
      return {
        success: false,
        error: Error(err)
      }
    }
  }

  async executeTransaction(queries: Query[]): Promise<Result<string, Error>> {
    if (this.pooling) return this.poolExecuteTransaction(queries)
    else return this.connectionExecuteTransaction(queries)
  }

  private async poolExecuteTransaction(queries: Query[]): Promise<Result<string, Error>> {
    let connection: PostgresPoolClient | undefined

    try {
      if (!this.pool) this.pool = new PostgresPool(this.poolConfig)

      connection = await this.pool.connect()

      await connection.query('BEGIN')

      for (const query of queries) {
        query.sql = this.replaceQuestionMarks(query.sql)
        await connection.query(query.sql, query.inputs)
      }

      await connection.query('COMMIT')

      return {
        success: true,
        rows: TRANSACTION_SUCCESS_MESSAGE
      }
    } catch (err) {
      if (connection) await connection.query('ROLLBACK')
      return {
        success: false,
        error: err
      }
    } finally {
      if (connection) connection.release()
    }
  }

  private async connectionExecuteTransaction(queries: Query[]): Promise<Result<string, Error>> {
    try {
      if (!this.connection) {
        this.connection = new PostgresConnection(this.config)
        await this.connection.connect()
      }

      await this.connection.query('BEGIN')

      for (let query of queries) {
        query.sql = this.replaceQuestionMarks(query.sql)
        await this.connection.query(query.sql, query.inputs)
      }

      await this.connection.query('COMMIT')

      return {
        success: true,
        rows: TRANSACTION_SUCCESS_MESSAGE
      }
    } catch (err) {
      if (this.connection) await this.connection.query('ROLLBACK')
      return {
        success: false,
        error: err
      }
    }
  }

  async end(): Promise<void> {
    if (this.connection) await this.connection.end()
    if (process.env.NODE_ENV === Environment.Test && this.pool) await this.pool.end()
  }
}
