import {
  createPool,
  createConnection,
  Connection as MysqlConnection,
  Pool as MysqlPool,
  ConnectionOptions as MysqlConfig,
  PoolOptions as MysqlPoolConfig,
  PoolConnection as MysqlPoolConnection
} from 'mysql2/promise'
import { injectable } from 'inversify'
import Connection from '../interfaces/Connection'
import { LambdaContainer, Environment, Property } from '../../aws-lambda-framework'
import { Query } from '../interfaces/Query'
import 'reflect-metadata'
import { QueryResult } from '../interfaces/QueryResult'

@injectable()
export class Mysql implements Connection {
  #connection?: MysqlConnection
  #pool?: MysqlPool
  logging = LambdaContainer.get<boolean>(Property.LOGGING)
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

  async execute<T>(query: Query): Promise<QueryResult<T>> {
    if (this.logging) console.log(`SQL: ${query.sql}\n${query.inputs ? `Inputs: [${query.inputs}]` : ''}`)

    if (this.pooling) return this.poolExecute(query)
    else return this.connectionExecute(query)
  }

  private async poolExecute<T>(query: Query): Promise<QueryResult<T>> {
    try {
      if (!this.#pool) this.#pool = await createPool(this.poolConfig)

      const [rows] = await this.#pool.execute(query.sql, query.inputs)

      if (Array.isArray(rows)) return { rows: rows as Array<T> }
      else return { rows: [], metadata: rows }
    } catch (err) {
      throw Error(err)
    }
  }

  private async connectionExecute<T>(query: Query): Promise<QueryResult<T>> {
    try {
      if (!this.#connection) this.#connection = await createConnection(this.config)

      const [rows] = await this.#connection.execute(query.sql, query.inputs)

      if (Array.isArray(rows)) return { rows: rows as Array<T> }
      else return { rows: [], metadata: rows }
    } catch (err) {
      throw Error(err)
    }
  }

  async executeTransaction<T>(queries: Query[]): Promise<QueryResult<T>[]> {
    if (this.pooling) return this.poolExecuteTransaction(queries)
    else return this.connectionExecuteTransaction(queries)
  }

  private async poolExecuteTransaction<T>(queries: Query[]): Promise<QueryResult<T>[]> {
    let connection: MysqlPoolConnection | undefined
    const res: QueryResult<T>[] = []

    try {
      if (!this.#pool) this.#pool = await createPool(this.poolConfig)
      connection = await this.#pool.getConnection()

      await connection.beginTransaction()

      for (const query of queries) {
        const [rows] = await connection.execute(query.sql, query.inputs)
        if (Array.isArray(rows)) res.push({ rows: rows as Array<T> })
        else res.push({ rows: [], metadata: rows })
      }

      await connection.commit()

      return res
    } catch (err) {
      if (connection) await connection.rollback()
      throw Error(err)
    }
  }

  private async connectionExecuteTransaction<T>(queries: Query[]): Promise<QueryResult<T>[]> {
    const transactionRes: QueryResult<T>[] = []

    try {
      if (!this.#connection) this.#connection = await createConnection(this.config)

      await this.#connection.beginTransaction()

      for (const query of queries) {
        const [rows] = await this.#connection.execute(query.sql, query.inputs)
        if (Array.isArray(rows)) transactionRes.push({ rows: rows as Array<T> })
        else transactionRes.push({ rows: [], metadata: rows })
      }

      await this.#connection.commit()

      return transactionRes
    } catch (err) {
      if (this.#connection) await this.#connection.rollback()
      throw Error(err)
    }
  }

  async end(): Promise<void> {
    if (this.#connection) await this.#connection.end()
    if (process.env.NODE_ENV === Environment.Test && this.#pool) await this.#pool.end()
  }
}
