import { IsFQDN, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsFQDN()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  activities: string;
}
