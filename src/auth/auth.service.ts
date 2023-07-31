import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(registerDto: RegisterDto): Promise<void> {
    await this.usersRepository.signUp(registerDto);
  }

  async signIn(authCredentialDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.validateUserPassword(
      authCredentialDto,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials.');
    }
    const payload: JwtPayload = { email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );
    return { accessToken };
  }
}
