import { LambdaContainer, InputValidator } from '../../../src/aws-lambda-framework'
import { TestRequest, TestRequestType } from '../constants/TestRequest'

describe('InputValidator', () => {
  it('should validate the input correctly', () => {
    let request: TestRequest = {
      id: 123,
      boolean: true,
      number: 123,
      string: 'test'
    }

    let validatedRequest: TestRequest = LambdaContainer.get(InputValidator).validate(request, TestRequestType)

    expect(validatedRequest).toBeDefined()
  })

  it('should validate JSON input correctly', () => {
    let request: TestRequest = {
      id: 123,
      boolean: true,
      number: 123,
      string: 'test'
    }

    let validatedRequest: TestRequest = LambdaContainer.get(InputValidator).validate(
      JSON.stringify(request),
      TestRequestType
    )

    expect(validatedRequest).toBeDefined()
  })

  it('should throw an error because of input being a string instead of a stringified object', () => {
    let request: string = 'a string instead of an object'

    expect(() => {
      let validatedRequest: TestRequest = LambdaContainer.get(InputValidator).validate(request, TestRequestType)
    }).toThrow()
  })

  it('should fail because boolean is a string', () => {
    let request = {
      id: 123,
      boolean: 'true',
      number: 123,
      string: 'test'
    }

    expect(() => {
      let validatedRequest: TestRequest = LambdaContainer.get(InputValidator).validate(request, TestRequestType)
    }).toThrow()
  })

  it('should fail because number is a string', () => {
    let request = {
      id: 123,
      boolean: true,
      number: '123',
      string: 'test'
    }

    expect(() => {
      let validatedRequest: TestRequest = LambdaContainer.get(InputValidator).validate(request, TestRequestType)
    }).toThrow()
  })

  it('should fail because string is a number', () => {
    let request = {
      id: 123,
      boolean: true,
      number: 123,
      string: 123
    }

    expect(() => {
      let validatedRequest: TestRequest = LambdaContainer.get(InputValidator).validate(request, TestRequestType)
    }).toThrow()
  })

  it('should fail because string is missing', () => {
    let request = {
      id: 123,
      boolean: true,
      number: 123
    }

    expect(() => {
      let validatedRequest: TestRequest = LambdaContainer.get(InputValidator).validate(request, TestRequestType)
    }).toThrow()
  })
})
