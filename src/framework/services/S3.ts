import { S3 as AWSS3 } from 'aws-sdk'
import { injectable, inject } from 'inversify'
import { Property } from '../symbols/Property'

@injectable()
export default class S3 extends AWSS3 {
  constructor(@inject(Property.REGION) region: string) {
    if (!region) throw 'Missing config for Lambda: region. Region can be set using process.env.REGION'
    super({ region: region })
  }
}
