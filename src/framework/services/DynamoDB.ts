import AWS from 'aws-sdk'
import { injectable } from 'inversify'

@injectable()
export class DynamoDB extends AWS.DynamoDB.DocumentClient {}
