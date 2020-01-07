import { LambdaContainer, InputValidator } from '../../../src/aws-lambda-framework'
import { TestInput } from '../constants/TestInput'

describe('InputValidator', () => {
  it('should validate the input correctly', async () => {
    let request = new TestInput('a valid string', 5)

    await expect(LambdaContainer.get(InputValidator).validateOrReject(request)).resolves.toBeUndefined()
  })

  it('should reject because string is too short', async () => {
    let request = new TestInput('too short', 5)

    await expect(LambdaContainer.get(InputValidator).validateOrReject(request)).rejects.toBeDefined()
  })

  it('should reject because int is too high', async () => {
    let request = new TestInput('long enough', 999)

    await expect(LambdaContainer.get(InputValidator).validateOrReject(request)).rejects.toBeDefined()
  })
})
