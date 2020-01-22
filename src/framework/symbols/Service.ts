export const Service = {
  INPUT_VALIDATOR: Symbol.for('Validator'),
  SLACK_NOTIFIER: Symbol.for('SlackNotifier'),
  POSTGRES: Symbol.for('Postgres'),
  MYSQL: Symbol.for('Mysql'),
  AURORA: Symbol.for('RDS'),
  REDSHIFT: Symbol.for('Redshift'),
  LAMBDA: Symbol.for('Lambda'),
  DYNAMODB: Symbol.for('DynamoDB'),
  DYNAMODC: Symbol.for('DynamoDC'),
  SSM: Symbol.for('SSM'),
  SES: Symbol.for('SES'),
  KINESIS: Symbol.for('Kinesis'),
  APIGATEWAY: Symbol.for('APIGateway'),
  CLOUDWATCH: Symbol.for('CloudWatch'),
  S3: Symbol.for('S3')
}
