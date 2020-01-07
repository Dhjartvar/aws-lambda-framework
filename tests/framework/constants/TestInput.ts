import { Length, Min, Max, IsInt } from 'class-validator'

export class TestInput {
  @Length(10, 20)
  testString: string

  @IsInt()
  @Min(0)
  @Max(10)
  testNumber: number

  constructor(testString: string, testNumber: number) {
    this.testString = testString
    this.testNumber = testNumber
  }
}
