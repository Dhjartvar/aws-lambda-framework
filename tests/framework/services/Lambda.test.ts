import { LambdaContainer, Lambda } from '../../../src/aws-lambda-framework'

describe('Lambda', () => {
  it('should resolve when trying to list functions', async () => {
    await expect(LambdaContainer.get(Lambda).listFunctions().promise()).resolves.toBeDefined()
  })
})
