import { LambdaContainer, Redshift, Property } from '../../../src/aws-lambda-framework'

describe('Redshift', () => {
  beforeAll(() => {
    if (!process.env.REDSHIFT_TEST_QUERY) throw 'Missing env var REDSHIFT_TEST_QUERY for Redshift.test.ts'
  })

  it('should query Redshift and retrieve more than zero rows', async () => {
    LambdaContainer.get(Redshift).pooling = false
    let res = await LambdaContainer.get(Redshift).execute(process.env.REDSHIFT_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })

  it('should query Redshift using a pool and retrieve more than zero rows', async () => {
    LambdaContainer.get(Redshift).pooling = true
    let res = await LambdaContainer.get(Redshift).execute(process.env.REDSHIFT_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })
  
  it('should throw query error because of bad sql', async () => {
    LambdaContainer.get(Redshift).pooling = false
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(true)
    await expect(LambdaContainer.get(Redshift).execute('bad sql')).rejects.toThrow()
  })
  
  it('should throw query error because of bad sql using a pool', async () => {
    LambdaContainer.get(Redshift).pooling = true
    LambdaContainer.rebind<boolean>(Property.LOGGING).toConstantValue(false)
    await expect(LambdaContainer.get(Redshift).execute('bad sql')).rejects.toThrow()
  })

  afterAll(async () => {
    await LambdaContainer.get(Redshift).end()
  })
})
