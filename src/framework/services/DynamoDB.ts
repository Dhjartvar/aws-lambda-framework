import AWS from 'aws-sdk'
import { injectable } from 'inversify'

@injectable()
export default class DynamoDB extends AWS.DynamoDB.DocumentClient {}
