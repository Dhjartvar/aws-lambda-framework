export default interface Connection {
  execute(sql: string, inputs?: any[]): Promise<unknown>
  end(): Promise<void>
}
