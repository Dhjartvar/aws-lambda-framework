# AWS Lambda Framework

A framework for simplifying writing Lambda functions in typescript on AWS featuring IoC (InversifyJS) with services for input validation (io-ts), sending slack notifications (lambda-slack-notifier) and using AWS services (such as using DynamoDB, Aurora, Redshift and more)

# Installation

```
npm i aws-lambda-framework
```

# Usage

```
// file TestLambda.ts

import { BaseLambda, LambdaContainer, Property, InputValidator, DynamoDB }
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { TestRequestType, TestRequest } from './TestRequest'

export class TestLambda extends BaseLambda {
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

```
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
