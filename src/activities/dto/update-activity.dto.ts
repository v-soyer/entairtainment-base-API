import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateActivityDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
