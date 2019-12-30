import { LambdaContainer, DynamoDB } from '../../../src/aws-lambda-framework'

describe('DynamoDB', () => {
  beforeAll(() => {
    if (!process.env.DYNAMODB_TEST_TABLE) throw 'Missing env var DYNAMODB_TEST_TABLE for DynamoDB.test.ts'
  })

  it('should scan a DynamoDB table and retrieve more than zero rows', async () => {
    let res = await LambdaContainer.get(DynamoDB)
      .scan({ TableName: process.env.DYNAMODB_TEST_TABLE! })
      .promise()

    expect(res.Count).toBeGreaterThan(0)
  })
})
