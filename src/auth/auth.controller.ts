import {
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, SignUpDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() signupInfo: SignUpDto) {
    console.log(' body ', signupInfo);
    const existUser = await this.userService.getByEmail(signupInfo.email);

    console.log('existUser ', existUser);
    if (existUser) {
      throw new ConflictException({ email_already_used: true });
    }

    const result = await this.userService.create(signupInfo);
    console.log(' Result ', result);

    return { success: true };
  }

  @Post('login')
  async login(@Body() loginInfo: LoginDto) {
    const unAuthorizeMessage = 'Email or Password is invalid.';
    const user = await this.userService.getByEmail(loginInfo.email, true);

    if (!user) {
      throw new UnauthorizedException(unAuthorizeMessage);
    }

    const isPasswordMatch = this.authService.checkPassword(
      loginInfo.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException(unAuthorizeMessage);
    }

    const token = this.authService.getSignInToken(user);
    return { token };
  }
}
