import { LambdaContainer, S3 } from '../../../src/aws-lambda-framework'

describe('S3', () => {
  it('should resolve when trying to list buckets ', async () => {
    await expect(LambdaContainer.get(S3).listBuckets().promise()).resolves.toBeDefined()
  })
})
