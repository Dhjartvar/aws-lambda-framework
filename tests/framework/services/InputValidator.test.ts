import { LambdaContainer, InputValidator } from '../../../src/aws-lambda-framework'
import { TestInput } from '../constants/TestInput'

describe('InputValidator', () => {
  it('should validate the input correctly', async () => {
    let request = new TestInput('a valid string', 123)

    let res = await LambdaContainer.get(InputValidator).validate(request)

    console.log('RES: ', res)
  })
})
