import { DynamoDB as AWSDynamoDB } from 'aws-sdk'
import { injectable, inject } from 'inversify'
import { Property } from '@framework/symbols/Property'

@injectable()
export default class DynamoDB extends AWSDynamoDB {
  constructor(@inject(Property.REGION) region: string) {
    if (!region) throw 'Missing config for Lambda: region. Region can be set using process.env.REGION'
    super({ region: region })
  }
}
