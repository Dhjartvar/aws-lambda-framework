import { LambdaContainer, DynamoDB } from '../../../src/aws-lambda-framework'

describe('DynamoDB', () => {
  beforeAll(() => {
    if (!process.env.DYNAMODB_TEST_TABLE) throw 'Missing env var DYNAMODB_TEST_TABLE for DynamoDB.test.ts'
  })

  it('should resolve when trying to list tables', async () => {
    await expect(
      LambdaContainer.get(DynamoDB)
        .listTables()
        .promise()
    ).resolves.toBeDefined()
  })
})
