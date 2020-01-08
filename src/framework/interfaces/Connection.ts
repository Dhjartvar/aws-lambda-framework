import { Result } from '@framework/types/Result'
import { Query } from './Query'

export default interface Connection {
  /**
   *
   * @param query The query to be executed
   * @returns A Result object with either an array of rows or an Error, depending on if Result.sucess is true
   */
  execute(query: Query): Promise<Result<any[], Error>>
  /**
   *
   * @param queries Queries to be run in the Transaction. They are executed sequentially.
   * @returns A Result object with either a success message or an Error, depending on if Result.sucess is true
   */
  executeTransaction(queries: Query[]): Promise<Result<string, Error>>
  end(): Promise<void>
}
