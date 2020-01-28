# AWS Lambda Framework

![npm](https://img.shields.io/npm/v/aws-lambda-framework)
![build](https://img.shields.io/travis/Dhjartvar/aws-lambda-framework)
![coverage](https://img.shields.io/codecov/c/github/Dhjartvar/aws-lambda-framework)
![dependencies](https://img.shields.io/david/Dhjartvar/aws-lambda-framework)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/Dhjartvar/aws-lambda-framework)
![license](https://img.shields.io/github/license/Dhjartvar/aws-lambda-framework)

A framework for simplifying writing AWS Lambda functions in typescript featuring IoC with services for input validation, sending slack notifications, connecting to databases, and using AWS services.

For release notes, see the [CHANGELOG](https://github.com/Dhjartvar/aws-lambda-framework/blob/master/CHANGELOG.md)

This project is still in the early stages, any feedback is much appreciated. Please let me know of any services or features you feel could improve this framework!

# Motivation

When developing microservice architectures on aws, a lot of common functionality has to be implemented into each Lambda function. This framework has been developed to provide that scaffolding as well streamline error handling and responses, such that anyone using Lambda functions through an API can always expect the same output.

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

## Kitchensink Example

```typescript
// KitchensinkLambda.ts

import {
  BaseLambda,
  APIGatewayProxyEvent,
  Context,
  LambdaResult,
  LambdaContainer,
  Property
} from '../../src/aws-lambda-framework'
import { inject } from 'inversify'
import { KitchensinkRepository } from './KitchensinkRepository'
import { UpdateKitchensinkRequest } from './UpdateKitchensinkRequest'
import { validatePermissions } from './validatePermissions'
import { validateRequest } from './validateRequest'

class KitchensinkLambda extends BaseLambda {
  @inject(KitchensinkRepository) private repo: KitchensinkRepository
  request: UpdateKitchensinkRequest

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.request = LambdaContainer.get<UpdateKitchensinkRequest>(Property.EVENT_BODY)
  }

  async invoke(): Promise<LambdaResult> {
    validatePermissions(['Superusers'])
    await validateRequest(this.request)

    const res = await this.repo.updateKitchenSink(this.request.updatedKitchensink)

    return {
      userMessage: 'Successfully updated Kitchensink!',
      data: res.metadata
    }
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context) {
  return new KitchensinkLambda(event, context)
}

// Kitchensink.ts

import { IsInt, Min, Max } from 'class-validator'

export class Kitchensink {
  id: number
  @IsInt()
  @Min(40)
  @Max(200)
  height: number
  @IsInt()
  @Min(80)
  @Max(400)
  width: number
}

// KitchensinkRepository.ts

import { injectable, inject } from 'inversify'
import { Mysql, Query } from '../../src/aws-lambda-framework'
import { QueryResult } from '../../src/framework/interfaces/QueryResult'
import { Kitchensink } from './Kitchensink'

@injectable()
export class KitchensinkRepository {
  @inject(Mysql) private mysql: Mysql

  async updateKitchenSink(kitchensink: Kitchensink): Promise<QueryResult<void>> {
    const query: Query = {
      sql: `
        UPDATE
          some_table (id, height, width)
        VALUES (
          ?,?,?
        )`,
      inputs: [kitchensink.id, kitchensink.height, kitchensink.width]
    }

    return this.mysql.execute(query)
  }
}

// UpdateKitchensinkRequest.ts

import { Kitchensink } from './Kitchensink'

export class UpdateKitchensinkRequest {
  updatedKitchensink: Kitchensink
}

// validatePermissions.ts

import { Property, LambdaContainer, CognitoToken, UnauthorizedError } from '../../src/aws-lambda-framework'

export function validatePermissions(whitelistedCognitoGroups: string[]): void {
  const cognitoGroups = LambdaContainer.get<CognitoToken>(Property.COGNITO_TOKEN)['cognito:groups']
  if (cognitoGroups.some(g => whitelistedCognitoGroups.includes(g))) throw new UnauthorizedError()
}

// validateRequest.ts

import { Validator, LambdaContainer, ValidationError } from '../../src/aws-lambda-framework'

export function validateRequest(request: object): Promise<void> {
  return LambdaContainer.get(Validator)
    .validateOrReject(request)
    .catch(errors => {
      throw new ValidationError(errors)
    })
}
```

# Services

The framework provides easy access to some of the tools that are often needed when writing Lambda functions. These are injected as singletons into the Container the first time they are called.

## Validator

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
