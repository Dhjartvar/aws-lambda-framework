import { Service, Inject } from 'typedi'
import { DynamoDB as AWSDynamoDB } from 'aws-sdk'

@Service()
export default class DynamoDB extends AWSDynamoDB {
  constructor(@Inject('region') region: string) {
    if (!region) throw 'Missing config for Lambda: region. Region can be set using process.env.REGION'
    super({ region: region })
  }
}
