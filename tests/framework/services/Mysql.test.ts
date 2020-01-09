import { Mysql, Query } from '../../../src/aws-lambda-framework'
let mysql: Mysql
const TRANSACTION_SUCCESS_MESSAGE = 'Succesfully executed all queries in transaction!'

describe('Mysql', () => {
  beforeAll(() => {
    if (!process.env.MYSQL_TEST_QUERY) throw 'Missing env var MYSQL_TEST_QUERY for Mysql.test.ts'
    mysql = new Mysql()
  })

  beforeEach(() => {
    mysql.pooling = true
  })

  it('should execute a query and return a successful Result containg rows of more than zero', async () => {
    mysql.pooling = false
    const query: Query = {
      sql: process.env.MYSQL_TEST_QUERY!,
      inputs: [1]
    }
    const res = await mysql.execute(query)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result.length).toBeGreaterThan(0)
  })

  it('should execute a query using a pool and return a successful Result containg rows of more than zero when using a pool', async () => {
    const query: Query = {
      sql: process.env.MYSQL_TEST_QUERY!,
      inputs: [1]
    }
    const res = await mysql.execute(query)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result.length).toBeGreaterThan(0)
  })

  it('should return an unsuccessful Result containing an error because of bad sql', async () => {
    mysql.pooling = false
    const res = await mysql.execute({ sql: 'bad sql' })
    expect(res.success).toBeFalsy()
    if (!res.success) expect(res.error).toBeDefined()
  })

  it('should return an unsuccessful Result containing an error because of bad sql when using a pool', async () => {
    const res = await mysql.execute({ sql: 'bad sql' })
    expect(res.success).toBeFalsy()
    if (!res.success) expect(res.error).toBeDefined()
  })

  it('should run a transaction of queries using a pool and return a successful Result with a success message', async () => {
    const queries: Query[] = [
      {
        sql: 'select * from countries'
      },
      {
        sql: 'select * from websites'
      }
    ]
    const res = await mysql.executeTransaction(queries)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result).toEqual(TRANSACTION_SUCCESS_MESSAGE)
  })

  it('should run a transaction of queries using a pool and return an unsuccessful Result because of bad sql', async () => {
    const queries: Query[] = [
      {
        sql: 'select * from countries'
      },
      {
        sql: 'bad sql'
      }
    ]
    const res = await mysql.executeTransaction(queries)
    expect(res.success).toBeFalsy()
    if (!res.success) expect(res.error).toBeDefined()
  })

  it('should run a transaction of queries and return a successful Result with a success message', async () => {
    mysql.pooling = false
    const queries: Query[] = [
      {
        sql: 'select * from countries'
      },
      {
        sql: 'select * from websites'
      }
    ]
    const res = await mysql.executeTransaction(queries)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result).toEqual(TRANSACTION_SUCCESS_MESSAGE)
  })

  it('should run a transaction of queries and return an unsuccessful Result because of bad sql', async () => {
    mysql.pooling = false
    const queries: Query[] = [
      {
        sql: 'select * from countries'
      },
      {
        sql: 'bad sql'
      }
    ]
    const res = await mysql.executeTransaction(queries)
    expect(res.success).toBeFalsy()
    if (!res.success) expect(res.error).toBeDefined()
  })

  afterAll(async () => {
    await mysql.end()
  })
})
