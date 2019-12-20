# AWS Lambda Framework

A framework for simplifying writing AWS Lambda functions in typescript featuring IoC with services for input validation, sending slack notifications, and using AWS services

# Installation

```
npm i aws-lambda-framework
```

# Usage

In the code below I've provided a simple show-case of how to use the framework for making a Lambda function with input validation that uses the DynamoDB service to scan a table. The result returned from the service will be always be wrapped inside the body of an HTTP response, such that the function can easily be used in conjunction with API Gateway. Should an error occur, it will be logged, a notification will be send to a Slack channel (if an incoming webhook for a channel is provided) and the error will be sent back in the body of the HTTP response.

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
  new TestLambda(event, context).useSlack(process.env.SLACK_WEBHOOK).handler()
```

Note that most standard configuration (such as the slack webhook or database credentials) can simply be provided as environment variables instead of setting it on the service itself. This will be covered in the next section

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

#Environment variables
The framework uses environment variables for the most basic configuration of services. Note that the environment variable is also used in some of these services, e.g. to disable sending Slack notifications unless the environment is set to production and closing connection pools in test environments.

Environment

- NODE_ENV

Slack

- SLACK_WEBHOOK

AWS

- REGION

Aurora

- AURORA_HOST
- AURORA_DB
- AURORA_USER
- AURORA_PASS
- AURORA_CONNECTIONS_LIMIT

Redshift

- REDSHIFT_HOST
- REDSHIFT_PORT
- REDSHIFT_DB
- REDSHIFT_USER
- REDSHIFT_PASS
- REDSHIFT_CONNECTIONS_LIMIT

#Roadmap

##More AWS services

##Travis-CI

##CodeCov

##Issue tracking

##Publish on npm
