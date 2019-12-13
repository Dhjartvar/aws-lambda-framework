export default interface Database {
  execute(sql: string, inputs?: any[]): Promise<unknown>
  end(): Promise<void>
}
