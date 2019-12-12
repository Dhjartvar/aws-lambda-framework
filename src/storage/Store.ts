import {
  ConnectionOptions as AuroraConfig,
  Connection as AuroraConnection,
  PoolConnection as AuroraPoolConnection,
  Pool as AuroraPool,
  PoolOptions as AuroraPoolConfig
} from 'mysql2/promise'
import {
  ClientConfig as RedshiftConfig,
  Connection as RedshiftConnection,
  PoolClient as RedshiftPoolConnection,
  Pool as RedshiftPool,
  PoolConfig as RedshiftPoolConfig
} from 'pg'

export default abstract class Store {
  abstract config: AuroraConfig | RedshiftConfig
  connection?: AuroraConnection | RedshiftConnection
  pool?: AuroraPool | RedshiftPool
  poolConnections?: AuroraPoolConnection[] | RedshiftPoolConnection[]

  constructor(pool: boolean) {
    this.validateConfig()
    if (pool) this.initializePool()
    else this.initializeConnection()
  }

  protected abstract validateConfig(): void
  protected abstract initializePool(): Promise<void>
  protected abstract initializeConnection(): Promise<void>

  abstract connect(): Promise<any>
  abstract execute(sql: string, inputs?: any[]): Promise<any>
  abstract end(): void
}
