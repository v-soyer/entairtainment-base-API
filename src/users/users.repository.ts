import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginDto } from '../auth/dto/login.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private logger = new Logger('User Repository');

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email: email });
  }

  async signUp(registerDto: RegisterDto): Promise<User> {
    const { username, email, password, passwordRepeat } = registerDto;

    if (password != passwordRepeat) {
      throw new BadRequestException("Passwords don't match");
    }

    const user = new User();
    Object.assign(user, registerDto);
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
      return user;
    } catch (error) {
      //23505 = duplicate
      if (error.code === '23505') {
        throw error.detail.includes('Key (email)')
          ? new ConflictException('This email is already taken')
          : new ConflictException('This username is already taken');
      }
      this.logger.error(`Error during user's registration: ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(LoginDto: LoginDto): Promise<User> {
    const { email, password } = LoginDto;
    const user = await this.findOneByEmail(email);

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
