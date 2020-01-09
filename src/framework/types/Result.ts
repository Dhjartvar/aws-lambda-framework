export type Result<Ok, Err> =
  | {
      readonly success: true
      readonly rows: Ok
    }
  | {
      readonly success: false
      readonly error: Err
    }
