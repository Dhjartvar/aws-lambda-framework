import { IsInt, Min, Max } from 'class-validator'

export class Kitchensink {
  id: number
  @IsInt()
  @Min(40)
  @Max(200)
  height: number
  @IsInt()
  @Min(80)
  @Max(400)
  width: number
}
