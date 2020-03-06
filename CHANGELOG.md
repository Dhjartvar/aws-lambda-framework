# Changelog for aws-lambda-framework

## [0.4.13] - 2020-03-06

### Changed

- Container scope changed from singleton to transient

## [0.4.12] - 2020-03-05

### Fix

- Now awaits invoke() rather than return in Lambda base classes

## [0.4.11] - 2020-03-05

### Changed

- Now using new private field syntax in Mysql and Postgres services

## [0.4.10] - 2020-03-05

### Fix

- Event is now json parsed if possible to support sls framework

## [0.4.9] - 2020-03-05

### Fix

- mysql2 createPool method is now awaited despite it's typings not returning a promise.

## [0.4.8] - 2020-03-05

### Refactor

- Mysql no longer uses default mysql lib import

## [0.4.7] - 2020-03-04

### Added

- SQSLambda for Lambda functions that respond to SQS events

### Fix

- AWS Exports

## [0.4.6] - 2020-02-14

### Fix

- Directory structure is no longer changed in build files

## [0.4.5] - 2020-02-14

### Fix

- Event Body is now rebound in the same way it is bound

## [0.4.4] - 2020-02-13

### Change

- Erorrs caught in Lambda function are no longer casted to LambdaErrors.

## [0.4.3] - 2020-02-13

### Fix

- Event body is now only parsed if possible, otherwise the raw data is used.

## [0.4.2] - 2020-02-13

### Fix

- userMessage prop in LambdaError is no longer overwritten.

## [0.4.1] - 2020-02-11

### Changed

- Removed Context from LambdaErrors

### Fix

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

### Fix

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
