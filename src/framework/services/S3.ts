import { Service, Inject } from 'typedi'
import { S3 as AWSS3 } from 'aws-sdk'

@Service()
export default class S3 extends AWSS3 {
  constructor(@Inject('region') region: string) {
    if (!region) throw 'Missing config for Lambda: region. Region can be set using process.env.REGION'
    super({ region: region })
  }
}
