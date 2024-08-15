import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUtils } from 'src/utils/response.utils';
import { Constants } from 'src/utils/constants';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly logger: Logger, 
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    this.logger.verbose(`Validating user: ${userName}`);

    const user = await this.authRepository.findUserByUserName(userName);
    
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        this.logger.debug(`User validated: ${userName}`);
        return result;
      } else {
        this.logger.warn(`Invalid password for user: ${userName}`);
      }
    } else {
      this.logger.warn(`User not found: ${userName}`);
    }
    
    return null;
  }

  async login(user: any) {
    this.logger.verbose(`Logging in user: ${user.userName}`);

    const payload = { userName: user.userName, role: user.role };
    const data = {
      access_token: this.jwtService.sign(payload),
      userName: user.userName || user._doc.userName,
      role: user.role || user._doc.role
    };

    this.logger.debug(`Login successful for user: ${user.userName}`);
    return ResponseUtils.successResponseHandler(201, "Successfully logged in.", "data", data);
  }

  async signup(createUserDto: CreateUserDto) {
    this.logger.verbose(`Signing up new user: ${createUserDto.userName}`);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.authRepository.createUser({ ...createUserDto, password: hashedPassword });

    this.logger.debug(`User signup successful: ${createUserDto.userName}`);
    return this.login(user);
  }

  async validateOAuthUser(username: string): Promise<any> {
    this.logger.verbose(`Validating OAuth user: ${username}`);

    let user = await this.authRepository.findUserByUserName(username);
    if (!user) {
      this.logger.debug(`OAuth user not found, creating new user: ${username}`);
      user = await this.authRepository.createUser({
        userName: username,
        password: '', // GitHub OAuth users won't have a password
        role: 'user', 
      });
    }

    this.logger.debug(`OAuth user validated or created: ${username}`);
    return this.login(user);
  }

  async validateUserByJwt(payload: { userName: string; role: string }): Promise<any> {
    this.logger.verbose(`Validating user by JWT: ${payload.userName}`);

    const user = await this.authRepository.findUserByUserName(payload.userName);
    if (!user) {
      this.logger.error(`Unauthorized request for user: ${payload.userName}`);
      throw new UnauthorizedException(Constants.UNAUTH_REQ);
    }

    this.logger.debug(`JWT validation successful for user: ${payload.userName}`);
    return user;
  }
}
