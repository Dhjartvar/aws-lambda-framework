import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { HttpStatusCode } from '../response/HttpStatusCode'
import APIGatewayResponse from '../response/APIGatewayResponse'
import { Container } from 'typedi'
import SlackNotifier from 'lambda-slack-notifier'
import { Environment } from '../container/Environment'
import Aurora from '@services/Aurora'
import Redshift from '@services/Redshift'
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
    Container.set('environment', process.env.NODE_ENV ?? Environment.Development)
    Container.set('pooling', process.env.pooling ?? true)
    Container.set('logging', process.env.logging ?? false)
  }

  abstract async invoke(): Promise<any>

  async handler(): Promise<APIGatewayProxyResult> {
    try {
      return APIGatewayResponse.build(HttpStatusCode.Ok, await this.invoke())
    } catch (e) {
      console.error(e)
      await Container.get(SlackNotifier).notify(e)
      return APIGatewayResponse.build(e.statusCode || HttpStatusCode.InternalServerError, e.errorMessage || e)
    } finally {
      await Promise.all([Container.get(Aurora).end(), Container.get(Redshift).end()])
    }
  }

  setEnvironment(environment: string) {
    Container.set('environment', environment)

    return this
  }

  setSlackWebhook(webhook: string) {
    Container.set('slack-webhook', webhook)

    return this
  }

  setPooling(enabled: boolean) {
    Container.set('pooling', enabled)

    return this
  }
}
