import AWS from 'aws-sdk'
import { injectable } from 'inversify'
import { Property } from '@framework/symbols/Property'
import LambdaContainer from '@framework/LambdaContainer'

@injectable()
export default class Lambda extends AWS.Lambda {
  /**
   * Method for invoking another Lambda function. Uses the invoke super function,
   * but parses payload and ClientContext and always returns a promise.
   * @param functionName The name of the Lambda function to be invoked
   * @param payload Input to send to the Lambda function. If input is an object, it is automatically stringified.
   * @param invocationType A Lambda function can be invoked synchronously (RequestResponse), asynchronously (Event) or as a dryrun (DryRun).
   * Synchronously (default) keeps the connection open until the function returns a response or times out.
   * Asynchronously invokes the can optionally use a dead-letter queue to retry invoking the function multiple times.
   * This call only returns a response with a status code.
   * DryRun can be used to validate parameter values and verify user or role permissions for invoking the function.
   * @returns A Promise containing AWSLambda.InvocationResponse
   */
  async invokeLambda(
    functionName: string,
    payload?: any,
    invocationType: string = 'RequestResponse'
  ): Promise<AWS.Lambda.InvocationResponse> {
    return super
      .invoke({
        FunctionName: functionName,
        Payload: payload ? (typeof payload === 'string' ? payload : JSON.stringify(payload)) : undefined,
        ClientContext: Buffer.from(JSON.stringify(LambdaContainer.get(Property.CONTEXT))).toString('base64'),
        InvocationType: invocationType
      })
      .promise()
  }
}
