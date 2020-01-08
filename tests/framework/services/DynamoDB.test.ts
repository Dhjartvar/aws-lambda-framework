import { LambdaContainer, DynamoDB } from '../../../src/aws-lambda-framework'

describe('DynamoDB', () => {
  it('should resolve when trying to list tables', async () => {
    await expect(
      LambdaContainer.get(DynamoDB)
        .listTables()
        .promise()
    ).resolves.toBeDefined()
  })
})
