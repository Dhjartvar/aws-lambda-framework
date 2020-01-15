# AWS Lambda Framework

[![NPM version]](https://www.npmjs.com/package/aws-sdk)

A framework for simplifying writing AWS Lambda functions in typescript featuring IoC with services for input validation, sending slack notifications, connecting to databases, and using AWS services.

For release notes, see the [CHANGELOG](https://github.com/Dhjartvar/aws-lambda-framework/blob/master/CHANGELOG.md)

This project is still in the early stages, any feedback is much appreciated. Please let me know of any services or features you feel could improve this framework!

# Installation

```
npm i aws-lambda-framework --save
```

# Usage

To utilize the framework your Lambda functions should extend the BaseLambda abstract class. This class provides scaffolding for your Lambda functions, ensuring that any results or errors are properly formatted for APIGateway and sent back to the caller. Errors are automatically logged and optionally send to a Slack channel of your choice. New Lambda functions must implement an `invoke` function, which ensures that the previously mentions points occur. This function also returns a LambdaResult to standardize the results for the end user, containing a userMessage and optionally a data object.

## Basic example

```typescript
// class TestLambda.ts

import {
  BaseLambda,
  LambdaContainer,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  LambdaResult,
  Mysql,
  LambdaError
} from '../../src/aws-lambda-framework'

class TestLambda extends BaseLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<LambdaResult> {
    try {
      const res = await LambdaContainer.get(Mysql).execute<Country>({
        sql: process.env.MYSQL_TEST_SQL!
      })

      return {
        userMessage: 'Successfully tested Lambda!',
        data: res.rows
      }
    } catch (err) {
      throw new LambdaError(err.message, err.stack, 'Failed to Test Lambda!')
    }
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new TestLambda(event, context).handler()
}

// interface Country.ts
interface Country {
  id: number
  name: string
  locale: string
  countryCode: number
}
```

# Services

The framework provides easy access to some of the tools that are often needed when writing Lambda functions. These are injected as singletons into the Container the first time they are called.

## InputValidator

## Mysql

## Postgres

## SlackNotifier

## AWS Services

- APIGateway
- Aurora
- Cloudwatch
- DynamoDB
- DynamoDC (Document Client)
- Kinesis
- Lambda
- RDS
- Redshift
- S3
- SES
- SSM

# Environment variables

The framework uses environment variables for the most basic configuration of services. Note that the environment variable is also used in some of these services, e.g. to disable sending Slack notifications unless the environment is set to production and closing connection pools in test environments.

Environment

- NODE_ENV

Slack

- SLACK_WEBHOOK

AWS

- REGION

Mysql

- MYSQL_HOST
- MYSQL_DB
- MYSQL_USER
- MYSQL_PASS
- MYSQL_CONNECTIONS_LIMIT

Postgres

- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASS
- POSTGRES_CONNECTIONS_LIMIT

# Roadmap

## More AWS services

## Travis-CI

## CodeCov

## Issue tracking
