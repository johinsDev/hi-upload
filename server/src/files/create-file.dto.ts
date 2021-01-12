import {
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateFileDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  path: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsInt()
  @Min(100)
  @Max(10000000)
  size: number;
}
