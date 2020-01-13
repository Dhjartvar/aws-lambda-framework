export type Result<Ok, Err> =
  | {
      readonly success: true
      readonly result: Ok
    }
  | {
      readonly success: false
      readonly error: Err
    }
