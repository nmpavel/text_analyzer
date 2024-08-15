
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUtils } from 'src/utils/response.utils';
import { Constants } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly authRepository: AuthRepository 
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.authRepository.findUserByUserName(userName);
    
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    
    return null;
  }  

  async login(user: any) {
    const payload = { userName: user.userName, role: user.role };
    const data = {
      access_token: this.jwtService.sign(payload),
      userName: user.userName || user._doc.userName ,
      role: user.role || user._doc.role
    };
    return ResponseUtils.successResponseHandler(201, "Successfully logged in.", "data", data);
  }

  async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.authRepository.createUser({ ...createUserDto, password: hashedPassword });
    return this.login(user);
  }

  async validateOAuthUser(username: string): Promise<any> {
    let user = await this.authRepository.findUserByUserName(username);
    if (!user) {
      user = await this.authRepository.createUser({
        userName: username,
        password: '', // GitHub OAuth users won't have a password
        role: 'user', 
      });
    }
    return this.login(user);
  }

  async validateUserByJwt(payload: { userName: string; role: string }): Promise<any> {
    const user = await this.authRepository.findUserByUserName(payload.userName);
    if (!user) {
      throw new UnauthorizedException(Constants.UNAUTH_REQ);
    }
    return user;
  }
}
