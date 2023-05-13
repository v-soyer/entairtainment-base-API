import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger('Auth Controller');

  @Post('/signup')
  signUp(@Body(ValidationPipe) registerDto: RegisterDto): Promise<void> {
    this.logger.verbose('[POST] / route is accessed');
    return this.authService.signUp(registerDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose('[POST] /signin route is accessed');
    return this.authService.signIn(loginDto);
  }
}
