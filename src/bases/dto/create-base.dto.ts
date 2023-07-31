import { ApiProperty } from '@nestjs/swagger';
import { IsFQDN, IsNotEmpty, IsString } from 'class-validator';

export class CreateBaseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsFQDN()
  @IsNotEmpty()
  @ApiProperty()
  link: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  activities: string;
}
