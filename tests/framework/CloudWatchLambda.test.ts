import { handler } from './CloudWatchLambda'
import { testContext } from './constants/LambdaTestContext'

describe('CloudWatchLambda', () => {
  it('should call the handler and resolve', async () => {
    await handler({ awslogs: { data: 'test' } }, testContext)
  })
})
