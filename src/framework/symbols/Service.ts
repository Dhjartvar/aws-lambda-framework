export const Service = {
  INPUT_VALIDATOR: Symbol.for('InputValidator'),
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
  Kinesis: Symbol.for('Kinesis'),
  APIGateway: Symbol.for('APIGateway'),
  CloudWatch: Symbol.for('CloudWatch'),
  S3: Symbol.for('S3')
}
