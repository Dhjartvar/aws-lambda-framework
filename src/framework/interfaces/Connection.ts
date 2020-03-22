import { Query } from './Query'
import { QueryResult } from './QueryResult'

export default interface Connection {
  /**
   *
   * @param query The query to be executed
   * @returns A Result object with either an array of rows or an Error, depending on if Result.sucess is true
   */
  execute<T>(query: Query): Promise<QueryResult<T>>
  /**
   *
   * @param queries Queries to be run in the Transaction. They are executed sequentially.
   * @returns A Result object with either a success message or an Error, depending on if Result.sucess is true
   */
  executeTransaction<T>(queries: Query[]): Promise<QueryResult<T>[]>
  end(): Promise<void>
}
