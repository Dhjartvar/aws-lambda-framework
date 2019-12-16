import { Context } from 'aws-lambda'

export const testContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  awsRequestId: 'test',
  functionName: 'test',
  functionVersion: 'test',
  invokedFunctionArn: 'test',
  memoryLimitInMB: 256,
  logGroupName: 'test',
  logStreamName: 'test',
  getRemainingTimeInMillis: () => 10000,
  done: () => {},
  fail: () => {},
  succeed: () => {}
}
