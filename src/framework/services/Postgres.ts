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
import { Query } from '../interfaces/Query'
import 'reflect-metadata'
import { QueryResult } from '../interfaces/QueryResult'
import { TransactionResult, TRANSACTION_SUCCESS_MESSAGE } from '../interfaces/TransactionResult'

@injectable()
export class Postgres implements Connection {
  private connection?: PostgresConnection
  private pool?: PostgresPool
  private logging = LambdaContainer.get<boolean>(Property.LOGGING)
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

  async execute<T>(query: Query): Promise<QueryResult<T>> {
    if (this.logging) console.log(`SQL: ${query.sql}\n${query.inputs ? `Inputs: [${query.inputs}]` : ''}`)

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

  private async poolExecute<T>(query: Query): Promise<QueryResult<T>> {
    try {
      if (!this.pool) this.pool = new PostgresPool(this.poolConfig)

      const res = await this.pool.query(query.sql, query.inputs)

      return {
        rows: res.rows as Array<T>,
        metadata: {
          fields: res.fields,
          command: res.command,
          oid: res.oid,
          rowCount: res.rowCount
        }
      }
    } catch (err) {
      throw Error(err)
    }
  }

  private async connectionExecute<T>(query: Query): Promise<QueryResult<T>> {
    try {
      if (!this.connection) {
        this.connection = new PostgresConnection(this.config)
        await this.connection.connect()
      }

      const res = await this.connection.query(query.sql, query.inputs)

      return {
        rows: res.rows as Array<T>,
        metadata: {
          fields: res.fields,
          command: res.command,
          oid: res.oid,
          rowCount: res.rowCount
        }
      }
    } catch (err) {
      throw Error(err)
    }
  }

  async executeTransaction(queries: Query[]): Promise<TransactionResult> {
    if (this.pooling) return this.poolExecuteTransaction(queries)
    else return this.connectionExecuteTransaction(queries)
  }

  private async poolExecuteTransaction(queries: Query[]): Promise<TransactionResult> {
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
        message: TRANSACTION_SUCCESS_MESSAGE
      }
    } catch (err) {
      if (connection) await connection.query('ROLLBACK')
      throw Error(err)
    } finally {
      if (connection) connection.release()
    }
  }

  private async connectionExecuteTransaction(queries: Query[]): Promise<TransactionResult> {
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
        message: TRANSACTION_SUCCESS_MESSAGE
      }
    } catch (err) {
      if (this.connection) await this.connection.query('ROLLBACK')
      throw Error(err)
    }
  }

  async end(): Promise<void> {
    if (this.connection) await this.connection.end()
    if (process.env.NODE_ENV === Environment.Test && this.pool) await this.pool.end()
  }
}
