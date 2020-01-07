import { LambdaContainer, SSM } from '../../../src/aws-lambda-framework'

describe('SSM', () => {
  it('should resolve when trying to list commands', async () => {
    await expect(
      LambdaContainer.get(SSM)
        .listCommands()
        .promise()
    ).resolves.toBeDefined()
  })
})
