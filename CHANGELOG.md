# Changelog for aws-lambda-framework

## [0.3.0] - 2020-01-27

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
