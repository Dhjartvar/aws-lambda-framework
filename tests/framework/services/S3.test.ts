import S3 from '../../../src/framework/services/S3'
import LambdaContainer from '../../../src/framework/LambdaContainer'

describe('S3', () => {
  it('should list buckets from S3 and retrieve more than zero buckets', async () => {
    let res = await LambdaContainer.get(S3)
      .listBuckets()
      .promise()

    console.log('RES: ', res)
  })
})
