import { LambdaContainer, DynamoDC } from '../../../src/aws-lambda-framework'

describe('DynamoDC', () => {
  beforeAll(() => {
    if (!process.env.DYNAMODB_TEST_TABLE) throw 'Missing env var DYNAMODB_TEST_TABLE for DynamoDB.test.ts'
  })

  it('should scan a DynamoDB table and retrieve more than zero rows', async () => {
    let res = await LambdaContainer.get(DynamoDC)
      .scan({ TableName: process.env.DYNAMODB_TEST_TABLE! })
      .promise()

    expect(res.Count).toBeGreaterThan(0)
  })
})
