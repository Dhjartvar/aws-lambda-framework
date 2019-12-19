import { Container } from 'inversify'
import 'reflect-metadata'
import AWS from 'aws-sdk'
import { Property } from '@framework/symbols/Property'
import { Environment } from '@framework/enums/Environment'
import { Region } from '@framework/enums/Region'
require('dotenv').config()

const LambdaContainer = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
  defaultScope: 'Request'
})

LambdaContainer.bind<string>(Property.REGION).toConstantValue(process.env.REGION ?? Region.Frankfurt)
LambdaContainer.bind<string>(Property.ENVIRONMENT).toConstantValue(process.env.NODE_ENV ?? Environment.Development)
LambdaContainer.bind<boolean>(Property.LOGGING).toConstantValue(
  process.env.LOGGING ? JSON.parse(process.env.LOGGING) : false
)

AWS.config.update({ region: LambdaContainer.get(Property.REGION) })

export default LambdaContainer
