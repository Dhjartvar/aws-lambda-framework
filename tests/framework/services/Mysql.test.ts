import { LambdaContainer, Property, Mysql } from '../../../src/aws-lambda-framework'
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8')

describe('Mysql', () => {
  beforeAll(() => {
    if (!process.env.Mysql_TEST_QUERY) throw 'Missing env var Mysql_TEST_QUERY for Mysql.test.ts'
  })

  it('should query Mysql and retrieve more than zero rows', async () => {
    LambdaContainer.get(Mysql).pooling = false
    const res = await LambdaContainer.get(Mysql).execute(process.env.Mysql_TEST_QUERY!, [1])
    res.expect(res.length).toBeGreaterThan(0)
  })

  it('should query Mysql using a pool and retrieve more than zero rows', async () => {
    LambdaContainer.get(Mysql).pooling = true
    const res = await LambdaContainer.get(Mysql).execute(process.env.Mysql_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })

  it('should throw query error because of bad sql', async () => {
    LambdaContainer.get(Mysql).pooling = false
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(true)
    await expect(LambdaContainer.get(Mysql).execute('bad sql')).rejects.toThrow()
  })

  it('should throw query error because of bad sql using a pool', async () => {
    LambdaContainer.get(Mysql).pooling = true
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(false)
    await expect(LambdaContainer.get(Mysql).execute('bad sql')).rejects.toThrow()
  })

  afterAll(async () => {
    await LambdaContainer.get(Mysql).end()
  })
})
