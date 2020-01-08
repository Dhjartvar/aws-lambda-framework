import { Container } from 'inversify'
import 'reflect-metadata'
import AWS from 'aws-sdk'
const S3 = AWS.S3
const Lambda = AWS.Lambda
const SSM = AWS.SSM
const DynamoDB = AWS.DynamoDB
const DynamoDC = AWS.DynamoDB.DocumentClient
const RDS = AWS.RDS
const Redshift = AWS.Redshift
const SES = AWS.SES
const Kinesis = AWS.Kinesis
const APIGateway = AWS.APIGateway
const CloudWatch = AWS.CloudWatch

import { Property } from '@framework/symbols/Property'
import { Environment } from '@framework/enums/Environment'
import { Region } from '@framework/enums/Region'
require('dotenv').config()

const LambdaContainer = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
  defaultScope: 'Singleton'
})

LambdaContainer.bind<string>(Property.REGION).toConstantValue(process.env.REGION ?? Region.Frankfurt)
LambdaContainer.bind<string>(Property.ENVIRONMENT).toConstantValue(process.env.NODE_ENV ?? Environment.Development)
LambdaContainer.bind<boolean>(Property.LOGGING).toConstantValue(
  process.env.LOGGING ? JSON.parse(process.env.LOGGING) : false
)

AWS.config.update({ region: LambdaContainer.get(Property.REGION) })

LambdaContainer.bind(Lambda).toConstantValue(new Lambda())
LambdaContainer.bind(S3).toConstantValue(new S3())
LambdaContainer.bind(SSM).toConstantValue(new SSM())
LambdaContainer.bind(DynamoDB).toConstantValue(new DynamoDB())
LambdaContainer.bind(DynamoDC).toConstantValue(new DynamoDC())
LambdaContainer.bind(RDS).toConstantValue(new RDS())
LambdaContainer.bind(Redshift).toConstantValue(new Redshift())
LambdaContainer.bind(SES).toConstantValue(new SES())
LambdaContainer.bind(Kinesis).toConstantValue(new Kinesis())
LambdaContainer.bind(APIGateway).toConstantValue(new APIGateway())
LambdaContainer.bind(CloudWatch).toConstantValue(new CloudWatch())

export { LambdaContainer }
