import { Metadata } from 'aws-sdk/clients/appstream'

/**
 * @return result rows
 */
export interface QueryResult<T> {
  rows: T[]
  metadata?: Metadata
}
