import Aurora from '../../../src/framework/services/Aurora'
import LambdaContainer from '../../../src/framework/LambdaContainer'

describe('Aurora', () => {
  beforeAll(() => {
    if (!process.env.AURORA_TEST_QUERY) throw 'Missing env var AURORA_TEST_QUERY for Aurora.test.ts'
  })

  it('should query Aurora and retrieve more than zero rows', async () => {
    let res = await LambdaContainer.get(Aurora).execute(process.env.AURORA_TEST_QUERY!, [1, 2])
    expect(res.length).toBeGreaterThan(0)
  })

  afterAll(async () => {
    await LambdaContainer.get(Aurora).end()
  })
})
