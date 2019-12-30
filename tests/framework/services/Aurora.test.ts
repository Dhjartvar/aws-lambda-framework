import { LambdaContainer, Property, Aurora } from '../../../src/aws-lambda-framework'
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

describe('Aurora', () => {
  beforeAll(() => {
    if (!process.env.AURORA_TEST_QUERY) throw 'Missing env var AURORA_TEST_QUERY for Aurora.test.ts'
  })

  it('should query Aurora and retrieve more than zero rows', async () => {
    LambdaContainer.get(Aurora).pooling = false
    let res = await LambdaContainer.get(Aurora).execute(process.env.AURORA_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })

  it('should query Aurora using a pool and retrieve more than zero rows', async () => {
    LambdaContainer.get(Aurora).pooling = true
    let res = await LambdaContainer.get(Aurora).execute(process.env.AURORA_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })
  
  it('should throw query error because of bad sql', async () => {
    LambdaContainer.get(Aurora).pooling = false
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(true)
    await expect(LambdaContainer.get(Aurora).execute('bad sql')).rejects.toThrow()
  })
  
  it('should throw query error because of bad sql using a pool', async () => {
    LambdaContainer.get(Aurora).pooling = true
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(false)
    await expect(LambdaContainer.get(Aurora).execute('bad sql')).rejects.toThrow()
  })

  afterAll(async () => {
    await LambdaContainer.get(Aurora).end()
  })
})
