import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { LoginDto, SignUpDto } from './auth.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

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
    return { success: true, loginInfo };
  }
}
