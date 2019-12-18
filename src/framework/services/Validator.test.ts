import InputValidator from './InputValidator'
import { TestRequest, TestRequestType } from '../../example/TestRequest'
import LambdaContainer from '../LambdaContainer'

describe('Validator', () => {
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