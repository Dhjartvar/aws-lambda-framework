import { handler } from './DynamoDBLambda'
import { testContext } from './constants/LambdaTestContext'

describe('DynamoDBLambda', () => {
  it('should call the handler and resolve', async () => {
    await handler({ Records: [] }, testContext)
  })
})
