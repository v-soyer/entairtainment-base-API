import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger('Auth Controller');

  @Post('/signup')
  @ApiCreatedResponse({ description: 'Successfull registration' })
  @ApiBadRequestResponse({
    description: "Your registration body doesn't match the expected body",
  })
  signUp(@Body(ValidationPipe) registerDto: RegisterDto): Promise<void> {
    this.logger.verbose('[POST] / route is accessed');
    return this.authService.signUp(registerDto);
  }

  @Post('/signin')
  @ApiCreatedResponse({ description: 'Generation of an access Token' })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  signIn(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose('[POST] /signin route is accessed');
    return this.authService.signIn(loginDto);
  }
}
