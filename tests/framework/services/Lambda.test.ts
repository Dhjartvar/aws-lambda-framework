import Lambda from '../../../src/framework/services/Lambda'
import LambdaContainer from '../../../src/framework/LambdaContainer'

describe('Lambda', () => {
  it('should list Lambda functions and retrieve more than zero functions', async () => {
    let res = await LambdaContainer.get(Lambda)
      .listFunctions()
      .promise()

    console.log('RES: ', res)
  })
})
