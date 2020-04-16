# Changelog for aws-lambda-framework

## [0.4.30] - 2020-04-16

### Fix

- Errors not being returned to user in APIGatewayLambda

## [0.4.29] - 2020-04-06

### Added

- SNSLambda for functions that are triggered by SNS.

### Changed

- SQSLambda now parses the body of each record contained in the SQS Event and saves it to the EVENT_BODY property

## [0.4.28] - 2020-04-02

### Added

- CognitoTriggerLambda for Cognito UserPool triggers.

## [0.4.27] - 2020-04-01

### Fix

- Cognito trigger Lambda bug

## [0.4.26] - 2020-04-01

### Fix

- Updated packages

## [0.4.25] - 2020-04-01

### Fix

- EventBody now bound to undefined if no input given
- No longer checks for warmup plugin in handler, as an error will be thrown in Lambda constructor before reaching this code. Instead put this into the handler function

## [0.4.21] - 2020-03-30

### Fix

- ServiceIdentifier rebind bug in rare cases

## [0.4.20] - 2020-03-24

### Added

- module-alias lib for ts paths support.

## [0.4.19] - 2020-03-22

### Fixed

- AWS exports no longer exported as types.

## [0.4.18] - 2020-03-22

### Changed

- executeTransaction on connections now returns an array of QueryResults.

## [0.4.17] - 2020-03-19

### Added

- Support for serverless-plugin-warmup by checking if function called from plugin in handler.

## [0.4.16] - 2020-03-19

### Added

- GraphQL support in APIGatewayLambda. Now returns the invoke result directly instead of parsing it if graphql path has been detected.

### Fixed

- QueryResult metadata now returns a type instead of unknown

## [0.4.15] - 2020-03-13

### Changed

- Errors are now always logged no matter the environment.

## [0.4.14] - 2020-03-10

### Changed

- Container default scope reverted to singleton

### Fixed

- If multiple mysql or postgres services are bound all of them will now be ended upon Lambda finish.

## [0.4.13] - 2020-03-06

### Changed

- Container scope changed from singleton to transient

## [0.4.12] - 2020-03-05

### Fixed

- Now awaits invoke() rather than return in Lambda base classes

## [0.4.11] - 2020-03-05

### Changed

- Now using new private field syntax in Mysql and Postgres services

## [0.4.10] - 2020-03-05

### Fixed

- Event is now json parsed if possible to support sls framework

## [0.4.9] - 2020-03-05

### Fixed

- mysql2 createPool method is now awaited despite it's typings not returning a promise.

## [0.4.8] - 2020-03-05

### Refactor

- Mysql no longer uses default mysql lib import

## [0.4.7] - 2020-03-04

### Added

- SQSLambda for Lambda functions that respond to SQS events

### Fixed

- AWS Exports

## [0.4.6] - 2020-02-14

### Fixed

- Directory structure is no longer changed in build files

## [0.4.5] - 2020-02-14

### Fixed

- Event Body is now rebound in the same way it is bound

## [0.4.4] - 2020-02-13

### Changed

- Erorrs caught in Lambda function are no longer casted to LambdaErrors.

## [0.4.3] - 2020-02-13

### Fixed

- Event body is now only parsed if possible, otherwise the raw data is used.

## [0.4.2] - 2020-02-13

### Fixed

- userMessage prop in LambdaError is no longer overwritten.

## [0.4.1] - 2020-02-11

### Changed

- Removed Context from LambdaErrors

### Fixed

- Constants are now rebound upon consecutive Lambda invocations.
- CognitoToken is now only bound if Authorization header exists.

## [0.4.0] - 2020-02-10

### Added

- Specific base classes for 3 types of Lambda functions: APIGateway, CloudWatch and DynamoDBStreams
- Basic examples for each type

### Changed

- Removed LambdaResult to instead let users define custom responses for each function

### Changed

- InputValidator renamed to Validator

### Fixed

- Removed explicit types in error classes where they were already implicit

## [0.3.1] - 2020-01-27

### Added

- Kitchensink example
- Travis CI integration
- CodeCov integration

### Changed

- InputValidator renamed to Validator

## [0.3.0] - 2020-01-15

### Added

- `LambdaResult` to standardize content sent back in the body of the HTTP response

### Changed

- Removed `Result` (Either) pattern because of improved error handling in BaseLambda and to have similar behaviour among services
- Unhandled errors will now be converted to LambdaErrors.

## [0.2.5] - 2020-01-14

### Added

- CloudFront AWS Service

## [0.2.4] - 2020-01-14

### Changed

- Reverted `Result` success object back to result.
- `Connection.execute` now returns a `QueryResult` containing the rows.
- `Connection.executeTransaction` now returns a `TransactionResult`.

## [0.2.3] - 2020-01-10

### Fixed

- Reflect.hasOwnMetadata bug by importing reflect-metadata into Services

## [0.2.2] - 2020-01-10

### Changed

- Updated README

## [0.2.1] - 2020-01-10

### Fixed

- No longer uses typescript paths. This broke type definitions when using the library @ npm.

## [0.2.0] - 2020-01-09

### Added

- Connection now has an `executeTransaction` function
- Many new AWS Services: `SSM`, `APIGateway`, `DynamoDB`, `RDS`, `Kinesis`, `Cloudwatch`, `SES`, `Aurora`, `Redshift`
- Custom Error classes (`LambdaError`, `ValidationError`, `UnauthorizedError`) for Lambda function that always returns its Context, Event and customizable status code / error messages

### Changed

- Renamed `Aurora` to `Mysql`.
- Renamed `Redshift` to `Postgres`.
- `Connection.execute` now returns a `Result` object with a generic type for rows. It now takes in a Query object containing sql and inputs.
- `InputValidator` now uses `class-validator` library instead of `io-ts` for more validation features.
