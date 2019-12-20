# AWS Lambda Framework

A framework for simplifying writing AWS Lambda functions in typescript featuring IoC with services for input validation, sending slack notifications, and using AWS services

# Installation

```
npm i aws-lambda-framework
```

# Usage

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
