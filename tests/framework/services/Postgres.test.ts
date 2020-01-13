import { Postgres, Query } from '../../../src/aws-lambda-framework'
let postgres: Postgres
import { TRANSACTION_SUCCESS_MESSAGE } from '../../../src/framework/interfaces/TransactionResult'

describe('Postgres', () => {
  beforeAll(() => {
    if (!process.env.POSTGRES_TEST_QUERY) throw 'Missing env var POSTGRES_TEST_QUERY for Postgres.test.ts'
    postgres = new Postgres()
  })

  beforeEach(() => {
    postgres.pooling = true
  })

  it('should query Postgres and retrieve more than zero rows', async () => {
    postgres.pooling = false
    const query: Query = {
      sql: process.env.POSTGRES_TEST_QUERY!,
      inputs: [1]
    }
    const res = await postgres.execute(query)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result.rows.length).toBeGreaterThan(0)
  })

  it('should query Postgres using a pool and retrieve more than zero rows', async () => {
    const query: Query = {
      sql: process.env.POSTGRES_TEST_QUERY!,
      inputs: [1]
    }
    const res = await postgres.execute(query)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result.rows.length).toBeGreaterThan(0)
  })

  it('should query Postgres using a pool and execute two queries simultanously', async () => {
    const queries: Query[] = [
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [1]
      },
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [2]
      }
    ]
    const res = await Promise.all([postgres.execute(queries[0]), postgres.execute(queries[1])])
    expect(res[0].success).toBeTruthy()
    expect(res[1].success).toBeTruthy()
    if (res[0].success) expect(res[0].result.rows.length).toBeGreaterThan(0)
    if (res[1].success) expect(res[1].result.rows.length).toBeGreaterThan(0)
  })

  it('should throw query error because of bad sql', async () => {
    postgres.pooling = false
    const res = await postgres.execute({ sql: 'bad sql' })
    expect(res.success).toBeFalsy()
    if (res.success === false) expect(res.error).toBeDefined()
  })

  it('should throw query error because of bad sql using a pool', async () => {
    const res = await postgres.execute({ sql: 'bad sql' })
    expect(res.success).toBeFalsy()
    if (res.success === false) expect(res.error).toBeDefined()
  })

  it('should run a transaction of queries using a pool and return a successful Result with a success message', async () => {
    const queries: Query[] = [
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [1]
      },
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [1]
      }
    ]
    const res = await postgres.executeTransaction(queries)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result.message).toEqual(TRANSACTION_SUCCESS_MESSAGE)
  })

  it('should run a transaction of queries using a pool and return an unsuccessful Result because of bad sql', async () => {
    postgres.pooling = false
    const queries: Query[] = [
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [1]
      },
      {
        sql: 'bad sql'
      }
    ]
    const res = await postgres.executeTransaction(queries)
    expect(res.success).toBeFalsy()
    if (res.success === false) expect(res.error).toBeDefined()
  })

  it('should run a transaction of queries and return a successful Result with a success message', async () => {
    postgres.pooling = false
    const queries: Query[] = [
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [1]
      },
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [1]
      }
    ]
    const res = await postgres.executeTransaction(queries)
    expect(res.success).toBeTruthy()
    if (res.success) expect(res.result.message).toEqual(TRANSACTION_SUCCESS_MESSAGE)
  })

  it('should run a transaction of queries and return an unsuccessful Result because of bad sql', async () => {
    postgres.pooling = false
    const queries: Query[] = [
      {
        sql: process.env.POSTGRES_TEST_QUERY!,
        inputs: [1]
      },
      {
        sql: 'bad sql'
      }
    ]
    const res = await postgres.executeTransaction(queries)
    expect(res.success).toBeFalsy()
    if (res.success === false) expect(res.error).toBeDefined()
  })

  afterAll(async () => {
    await postgres.end()
  })
})
