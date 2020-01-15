/**
 * @return result rows
 */
export interface QueryResult<T> {
  rows: T[]
  metadata?: unknown
}
