import AWS from 'aws-sdk'
import { injectable } from 'inversify'

@injectable()
export default class S3 extends AWS.S3 {}
