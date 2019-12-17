import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { HttpStatusCode } from './enums/HttpStatusCode'
import APIGatewayResponse from './response/APIGatewayResponse'
import { Container } from 'typedi'
import SlackNotifier from '@services/SlackNotifier'
import { Environment } from './enums/Environment'
import Aurora from '@services/Aurora'
import Redshift from '@services/Redshift'
import { RegionName } from 'aws-sdk/clients/dynamodb'
import { Region } from './enums/Region'
import AuroraConfig from './interfaces/AuroraConfig'
import { PoolOptions, ConnectionOptions } from 'mysql2'
require('dotenv').config()

export default abstract class BaseLambda {
  readonly event: APIGatewayProxyEvent
  readonly body?: object
  readonly queryStringParameters?: any
  readonly pathParameters?: any
  readonly context: Context

  constructor(event: APIGatewayProxyEvent, context: Context) {
    this.event = typeof event === 'string' ? JSON.parse(event) : event
    this.body = typeof this.event.body === 'string' ? JSON.parse(this.event.body) : this.event.body
    this.queryStringParameters = this.event.queryStringParameters
    this.pathParameters = this.event.pathParameters
    this.context = context
    this.initializeContainer()
  }

  private initializeContainer(): void {
    Container.set('body', this.body)
    Container.set('event', this.event)
    Container.set('query-string-parameters', this.queryStringParameters)
    Container.set('path-parameters', this.pathParameters)
    Container.set('context', this.context)
    Container.set('region', process.env.REGION ?? 'eu-central-1')
    Container.set('environment', process.env.NODE_ENV ?? Environment.Development)
    Container.set('logging', process.env.LOGGING ?? false)
  }

  abstract async invoke(): Promise<any>

  async handler(): Promise<APIGatewayProxyResult> {
    try {
      return APIGatewayResponse.build(HttpStatusCode.Ok, await this.invoke())
    } catch (e) {
      console.error(e)
      await Container.get(SlackNotifier).notify(e.message ?? e)
      return APIGatewayResponse.build(e.statusCode ?? HttpStatusCode.InternalServerError, e.message ?? e)
    } finally {
      await Promise.all([Container.get(Aurora).end(), Container.get(Redshift).end()])
    }
  }

  setEnvironment(environment: Environment) {
    Container.set('environment', environment)

    return this
  }

  setRegion(region: Region) {
    Container.set('region', region)

    return this
  }

  setLogging(enabled: boolean) {
    Container.set('logging', enabled)

    return this
  }
}
