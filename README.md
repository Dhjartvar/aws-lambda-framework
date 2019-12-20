# AWS Lambda Framework

A framework for simplifying writing AWS Lambda functions in typescript featuring IoC with services for input validation, sending slack notifications, and using AWS services

# Installation

```
npm i aws-lambda-framework
```

# Usage

In the code below I've provided a simple show-case of how to use the framework for making a Lambda function with input validation that uses the DynamoDB service to scan a table. The result returned from the service will be always be wrapped inside the body of an HTTP response, such that the function can easily be used in conjunction with API Gateway. Should an error occur, it will be logged, a notification will be send to a Slack channel (given a provided incoming webhook for that channel) and the error will be sent back in the body of the HTTP response.

```typescript
// file TestLambda.ts

import { BaseLambda, LambdaContainer, Property, InputValidator, DynamoDB } from 'aws-lambda-framework'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { TestRequestType, TestRequest } from './TestRequest'

export default class TestLambda extends BaseLambda {
  request: TestRequest

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.request = LambdaContainer.get(InputValidator).validate(
      LambdaContainer.get<object>(Property.EVENT_BODY),
      TestRequestType
    )
  }

  async invoke(): Promise<any> {
    return LambdaContainer.get(DynamoDB)
      .scan({ TableName: process.env.DYNAMODB_TEST_TABLE! })
      .promise()
  }
}

exports.handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  new TestLambda(event, context).handler()
```

Below is a mock of how to define an interface for validation with the io-ts library, which the InputValidator is based on.

```typescript
// file TestRequest.ts

import * as t from 'io-ts'

export const TestRequestType = t.interface({
  id: t.number,
  number: t.number,
  string: t.string,
  boolean: t.boolean
})

export type TestRequest = t.TypeOf<typeof TestRequestType>
```
