import {
  Client as RedshiftConnection,
  Pool as RedshiftPool,
  PoolClient as RedshiftPoolClient,
  ConnectionConfig as RedshiftConfig,
  PoolConfig as RedshiftPoolConfig
} from 'pg'
import { injectable } from 'inversify'
import Connection from '@framework/interfaces/Connection'
import { LambdaContainer, Environment, Property } from '../../aws-lambda-framework'
import { Result } from '@framework/types/Result'

@injectable()
export class Redshift implements Connection {
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

  async execute(sql: string, inputs?: any[]): Promise<Result<any[], Error>> {
    const formattedSql = this.replaceQuestionMarks(sql)
    if (this.pooling) return this.poolExecute(formattedSql, inputs)
    else return this.connectionExecute(formattedSql, inputs)
  }

  private async poolExecute(sql: string, inputs?: any[]): Promise<Result<any[], Error>> {
    let index = 0
    try {
      if (!this.pool) this.pool = new RedshiftPool(this.poolConfig)

      this.poolConnections.push(await this.pool!.connect())
      index = this.poolConnections.length - 1

      const result = await this.poolConnections[index].query(sql, inputs)
      return {
        success: true,
        result: result.rows
      }
    } catch (err) {
      return {
        success: false,
        error: Error(err)
      }
    } finally {
      this.poolConnections[index].release()
      delete this.poolConnections[index]
    }
  }

  private async connectionExecute(sql: string, inputs?: any[]): Promise<Result<any[], Error>> {
    try {
      if (!this.connection) {
        this.connection = new RedshiftConnection(this.config)
        await this.connection.connect()
      }

      const result = await this.connection.query(sql, inputs)
      return {
        success: true,
        result: result.rows
      }
    } catch (err) {
      return {
        success: false,
        error: Error(err)
      }
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
