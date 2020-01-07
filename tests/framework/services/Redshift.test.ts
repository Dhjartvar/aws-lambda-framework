import { LambdaContainer, Postgres, Property } from '../../../src/aws-lambda-framework'

describe('Postgres', () => {
  beforeAll(() => {
    if (!process.env.Postgres_TEST_QUERY) throw 'Missing env var Postgres_TEST_QUERY for Postgres.test.ts'
  })

  it('should query Postgres and retrieve more than zero rows', async () => {
    LambdaContainer.get(Postgres).pooling = false
    let res = await LambdaContainer.get(Postgres).execute(process.env.Postgres_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })

  it('should query Postgres using a pool and retrieve more than zero rows', async () => {
    LambdaContainer.get(Postgres).pooling = true
    let res = await LambdaContainer.get(Postgres).execute(process.env.Postgres_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })

  it('should throw query error because of bad sql', async () => {
    LambdaContainer.get(Postgres).pooling = false
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(true)
    await expect(LambdaContainer.get(Postgres).execute('bad sql')).rejects.toThrow()
  })

  it('should throw query error because of bad sql using a pool', async () => {
    LambdaContainer.get(Postgres).pooling = true
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(false)
    await expect(LambdaContainer.get(Postgres).execute('bad sql')).rejects.toThrow()
  })

  afterAll(async () => {
    await LambdaContainer.get(Postgres).end()
  })
})
