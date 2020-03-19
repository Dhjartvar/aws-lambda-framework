import { Metadata } from './Metadata'

/**
 * @return result rows
 */
export interface QueryResult<T> {
  rows: T[]
  metadata?: Metadata
}
