import * as t from 'io-ts'

export const TestRequestType = t.interface({
  id: t.number,
  number: t.number,
  string: t.string,
  boolean: t.boolean
})

export type TestRequest = t.TypeOf<typeof TestRequestType>
