import Redshift from '../../../src/framework/services/Redshift'
import LambdaContainer from '../../../src/framework/LambdaContainer'

describe('Redshift', () => {
  beforeAll(() => {
    if (!process.env.REDSHIFT_TEST_QUERY) throw 'Missing env var REDSHIFT_TEST_QUERY for Redshift.test.ts'
  })

  it('should query Redshift and retrieve more than zero rows', async () => {
    LambdaContainer.get(Redshift).pooling = false
    let res = await LambdaContainer.get(Redshift).execute(process.env.REDSHIFT_TEST_QUERY!, [1])
    expect(res.length).toBeGreaterThan(0)
  })

  afterAll(async () => {
    await LambdaContainer.get(Redshift).end()
  })
})
