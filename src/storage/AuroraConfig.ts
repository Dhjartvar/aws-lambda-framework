import { ConnectionOptions, PoolOptions } from 'mysql2'

export default interface AuroraConfig extends ConnectionOptions, PoolOptions {}
