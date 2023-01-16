import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCoffeeDto {
  @ApiProperty({description: 'The name of the coffee', example: 'Monarch'})
  @IsString()
  readonly name: string;

  @ApiProperty({description: 'The brand of the coffee', example: 'Jacobs'})
  @IsString()
  readonly brand: string;

  @ApiProperty({description: 'Array of flavors of coffee', example: ['chocolate', 'milk']}) 
  @IsString({each: true})
  readonly flavors: string[];
}
