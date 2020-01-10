# Changelog for aws-lambda-framework

## [0.2.1] - 2020-01-10

### Fix

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
