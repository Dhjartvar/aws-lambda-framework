import { Validator, LambdaContainer, ValidationError } from "../../src/aws-lambda-framework";

export function validateRequest(request: object): Promise<void> {
  return LambdaContainer.get(Validator)
    .validateOrReject(request)
    .catch(errors => {
      throw new ValidationError(errors)
    })
}