export interface DCQuery {
  TableName: string
  IndexName?: string
  KeyConditionExpression?: string
  ExpressionAttributeValues: object
  ExclusiveStartKey: object
  Limit?: string
  ProjectionExpression?: string
  QueryFilter?: {}
}
