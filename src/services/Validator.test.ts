import Container from "typedi"
import Validator from './Validator'
import { TestRequest, TestRequestType } from "../example/TestRequest"

describe('Validator', () => {
  beforeEach(() => {
    Container.set(Validator, new Validator())
  })

  it('should validate the input correctly', () => {
    let request: TestRequest = {
      id: 123,
      boolean: true,
      number: 123,
      string: 'test'
    }

    let validatedRequest: TestRequest = Container.get(Validator).validate(request, TestRequestType)

    expect(validatedRequest).toBeDefined()
  })

  it('should fail because boolean is a string', () => {
    let request = {
      id: 123,
      boolean: 'true',
      number: 123,
      string: 'test'
    }

    expect(() => { let validatedRequest: TestRequest = Container.get(Validator).validate(request, TestRequestType) }).toThrow()
  })

  it('should fail because number is a string', () => {
    let request = {
      id: 123,
      boolean: true,
      number: '123',
      string: 'test'
    }

    expect(() => { let validatedRequest: TestRequest = Container.get(Validator).validate(request, TestRequestType) }).toThrow()
  })

  it('should fail because string is a number', () => {
    let request = {
      id: 123,
      boolean: true,
      number: 123,
      string: 123
    }

    expect(() => { let validatedRequest: TestRequest = Container.get(Validator).validate(request, TestRequestType) }).toThrow()
  })

  it('should fail because string is missing', () => {
    let request = {
      id: 123,
      boolean: true,
      number: 123
    }

    expect(() => { let validatedRequest: TestRequest = Container.get(Validator).validate(request, TestRequestType) }).toThrow()
  })
})
