import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { HttpStatusCode } from '../response/HttpStatusCode'
import APIGatewayResponse from '../response/APIGatewayResponse'
import { Container } from 'typedi'
import SlackNotifier from 'src/notification/SlackNotifier'
import { StoreToken } from 'src/storage/StoreToken'

export default abstract class Lambda {
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
    Container.set('context', this.pathParameters)
    Container.set('environment', process.env.NODE_ENV)
    Container.set('slack-webhook', process.env.SLACK_WEBHOOK)
    Container.set('pooling', process.env.pooling ?? true)
  }

  abstract async invoke(): Promise<any>

  async handler(): Promise<APIGatewayProxyResult> {
    try {
      return APIGatewayResponse.build(HttpStatusCode.Ok, await this.invoke())
    } catch (e) {
      console.error(e)
      Container.get(SlackNotifier).notify(e)
      return APIGatewayResponse.build(e.statusCode || HttpStatusCode.InternalServerError, e.errorMessage || e)
    } finally {
      Container.getMany(StoreToken).forEach(store => store.end())
    }
  }

  public setEnvironment(environment: string) {
    Container.set('environment', environment)

    return this
  }

  public setSlackWebhook(webhook: string) {
    Container.set('slack-webhook', webhook)

    return this
  }

  public setPooling(boolean: boolean) {
    Container.set('pooling', boolean)

    return this
  }

  public validateInput() {
    throw 'Not yet implemented'
  }
}
