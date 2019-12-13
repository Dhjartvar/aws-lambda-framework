import * as t from 'io-ts'

export const RequestType = t.interface({
  id: t.number,
  prop: t.number,
  otherProp: t.boolean
})

export type Request = t.TypeOf<typeof RequestType>
