import { Result } from '@framework/types/Result'

export default interface Connection {
  execute(sql: string, inputs?: any[]): Promise<Result<any[], Error>>
  end(): Promise<void>
}
