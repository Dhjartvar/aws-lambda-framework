import { ClientConfig, PoolConfig } from 'pg'

export default interface RedshiftConfig extends ClientConfig, PoolConfig {}
