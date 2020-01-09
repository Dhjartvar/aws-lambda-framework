# Changelog for aws-lambda-framework

## 0.2.0

- Feature: Connection now has an executeTransaction function
- Feature: Many new AWS Services
- Feature: Custom Error classes for Lambda function that always returns its Context, Event and customizable status code / error messages
- Refactor: Connection.execute now returns a Result object with a generic type for rows
- Refactor: InputValidator now uses class-validator library instead of io-ts.
