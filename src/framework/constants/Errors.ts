import { HttpStatusCode } from '@framework/enums/HttpStatusCode'

export const CONNECTION_ERROR = (err: any, service: string, config: any) => {
  return {
    config: config,
    err: err,
    message: `Encountered '${err}' while connecting to ${service}}`
  }
}

export const INVALID_INPUT_ERROR = (input: any, type: any) => {
  return {
    input: input,
    message: `Received invalid input ${JSON.stringify(input)} expected to receive type ${type.name}`,
    statusCode: HttpStatusCode.BadRequest,
    expectedType: type.name
  }
}

export const QUERY_ERROR = (err: any, sql: string, inputs?: any[]) => {
  let errorMessage = {
    err: err,
    inputs: inputs,
    message: `Encountered '${err}' while executing query '${sql}'${inputs ? ` with input [${inputs}]` : ''}`,
    sql: sql
  }
  if (!inputs) delete errorMessage.inputs
  return errorMessage
}
